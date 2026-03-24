package com.workwise.workwisebackend.services;

import com.workwise.workwisebackend.entities.Credential;
import com.workwise.workwisebackend.entities.JobOffer;
import com.workwise.workwisebackend.entities.Notification;
import com.workwise.workwisebackend.entities.actors.Company;
import com.workwise.workwisebackend.entities.actors.User;
import com.workwise.workwisebackend.repositories.CompanyRepository;
import com.workwise.workwisebackend.repositories.CredentialRepository;
import com.workwise.workwisebackend.repositories.NotificationRepository;
import com.workwise.workwisebackend.repositories.UserRepository;
import com.workwise.workwisebackend.support.utils.RecipientType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CredentialRepository credentialsRepository;

    @Autowired
    private CompanyRepository companyRepository;

    public void notifyAllCandidatesNewJobOffer(JobOffer jobOffer) {
        List<User> candidates = userRepository.findAll();

        for (User candidate : candidates) {
            Notification notification = new Notification();
            notification.setType("New JobOffer");
            notification.setMessage("Hi " + candidate.getFirstName() + ". A new job offer is available: " + jobOffer.getTitle() + ": " + jobOffer.getDescription());
            notification.setRecipientId(candidate.getId());
            notification.setRecipientType(RecipientType.CANDIDATE);
            notificationRepository.save(notification);
        }
    }

    public Page<Notification> getAllMyNotifications(Pageable pageable, String email) {
        Credential credentials = credentialsRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Optional<User> optionalUser = userRepository.findByCredentials(credentials.getId());

        if (optionalUser.isPresent()) {
            User user = optionalUser.get();

            return notificationRepository.findByRecipientIdAndRecipientTypeOrderByCreatedAtDesc(pageable, user.getId(), RecipientType.CANDIDATE);
        }
        Optional<Company> optionalCompany = companyRepository.findByCredentials(credentials.getId());

        if (optionalCompany.isPresent()) {
            Company company = optionalCompany.get();
            return notificationRepository.findByRecipientIdAndRecipientTypeOrderByCreatedAtDesc(pageable, company.getId(), RecipientType.COMPANY);

        }

        throw new RuntimeException("No user or company found for the provided credentials");
    }

    public Notification markAsRead(Long notificationId, String email) {
        Credential credentials = credentialsRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new IllegalArgumentException("Job Offer not found"));

        Optional<User> optionalUser = userRepository.findByCredentials(credentials.getId());

        if (optionalUser.isPresent()) {
            User user = optionalUser.get();

            notification.setIsRead(true);
            return notificationRepository.save(notification);

        }
        Optional<Company> optionalCompany = companyRepository.findByCredentials(credentials.getId());

        if (optionalCompany.isPresent()) {
            Company company = optionalCompany.get();
            notification.setIsRead(true);

            return notificationRepository.save(notification);
        }

        throw new RuntimeException("No user or company found for the provided credentials");
    }

    public Notification markAsUnread(Long notificationId, String email) {
        Credential credentials = credentialsRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new IllegalArgumentException("Job Offer not found"));

        Optional<User> optionalUser = userRepository.findByCredentials(credentials.getId());

        if (optionalUser.isPresent()) {
            User user = optionalUser.get();

            notification.setIsRead(false);
            return notificationRepository.save(notification);

        }
        Optional<Company> optionalCompany = companyRepository.findByCredentials(credentials.getId());

        if (optionalCompany.isPresent()) {
            Company company = optionalCompany.get();
            notification.setIsRead(false);

            return notificationRepository.save(notification);
        }

        throw new RuntimeException("No user or company found for the provided credentials");
    }

    public Optional<Notification> deleteNotification(Long notificationId, String email) {
        Credential credentials = credentialsRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new IllegalArgumentException("Job Offer not found"));

        Optional<User> optionalUser = userRepository.findByCredentials(credentials.getId());

        if (optionalUser.isPresent()) {
            User user = optionalUser.get();

            notification.setIsRead(false);
            notificationRepository.deleteById(notification.getId());

            return Optional.of(notification);
        }
        Optional<Company> optionalCompany = companyRepository.findByCredentials(credentials.getId());

        if (optionalCompany.isPresent()) {
            Company company = optionalCompany.get();
            notification.setIsRead(false);

            notificationRepository.deleteById(notification.getId());

            return Optional.of(notification);        }

        throw new RuntimeException("No user or company found for the provided credentials");
    }

    public List<Notification> deleteAllNotifications(String email) {

        Credential credentials = credentialsRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));


        Optional<User> optionalUser = userRepository.findByCredentials(credentials.getId());

        if (optionalUser.isPresent()) {
            List<Notification> notifications = notificationRepository.findAllByRecipientId(optionalUser.get().getId());

            notificationRepository.deleteAll(notifications);
            return notifications;
        }
        Optional<Company> optionalCompany = companyRepository.findByCredentials(credentials.getId());

        if (optionalCompany.isPresent()) {
            List<Notification> notifications = notificationRepository.findAllByRecipientId(optionalCompany.get().getId());

            notificationRepository.deleteAll(notifications);
            return notifications;
        }

        throw new RuntimeException("No user or company found for the provided credentials");
    }
}
