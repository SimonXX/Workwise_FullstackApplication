package com.workwise.workwisebackend.services;

import com.workwise.workwisebackend.entities.Credential;
import com.workwise.workwisebackend.entities.actors.User;
import com.workwise.workwisebackend.repositories.CredentialRepository;
import com.workwise.workwisebackend.repositories.UserRepository;
import com.workwise.workwisebackend.repositories.mapper.UserMapper;
import com.workwise.workwisebackend.repositories.modelDTO.UserDTO;
import com.workwise.workwisebackend.repositories.modelDTO.UserInformationDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CredentialRepository credentialRepository;

    public UserService(UserRepository userRepository){
        this.userRepository = userRepository;
    }

    public List<User> getAllUsers(){

        return userRepository.findAll();
    }

    public Optional<User> getUserById(Long userId){
        return userRepository.findById(userId);
    }

    public List<User> getUserByLastName(String userLastName){
        return userRepository.findByLastName(userLastName);
    }

    public List<User> getUserByName(String userName){
        return userRepository.findByFirstName(userName);
    }

    public UserDTO getUserByEmail(String email){
        Optional<Credential> credential= credentialRepository.findByEmail(email);

        Long credentialId = credential.get().getId();

        Optional<User> user = userRepository.findByCredentials(credentialId);
        UserDTO userDTO = UserMapper.mapUserToUserDTO(user.get());
        return userDTO;

    }

    public UserDTO updateUser(UserDTO userDTO, String email) {
        // Trova le credenziali tramite email
        Credential credentials = credentialRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Trova l'utente tramite le credenziali
        User existsUser = userRepository.findByCredentials(credentials.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Verifica che l'email corrisponda
        if (!credentials.getEmail().equals(email)) {
            throw new RuntimeException("Access Denied");
        }

        // Aggiorna solo i campi specificati
        existsUser.setFirstName(userDTO.getFirstName());
        existsUser.setLastName(userDTO.getLastName());
        existsUser.setPhone(userDTO.getPhone());
        existsUser.setAddress(userDTO.getAddress());
        existsUser.setDateOfBirth(userDTO.getDateOfBirth());
        existsUser.setCv(userDTO.getCvBase64());


        return UserMapper.mapUserToUserDTO(userRepository.save(existsUser));
    }

    public UserInformationDTO getUserCV(String email){
        Credential credentials = credentialRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Optional<User> user = userRepository.findByCredentials(credentials.getId());

        if(user.isPresent()){
            UserInformationDTO inf = new UserInformationDTO();

            inf.setFirstName(user.get().getFirstName());
            inf.setLastName(user.get().getLastName());
            inf.setPhone(user.get().getPhone());
            inf.setAddress(user.get().getAddress());
            inf.setCvBase64(user.get().getCv());

            return inf;
        }

        throw new RuntimeException("User not found");
    }

    public UserInformationDTO getUserInformationById(Long userId){


        Optional<User> user = userRepository.findById(userId);

        if(user.isPresent()){
            UserInformationDTO inf = new UserInformationDTO();

            Credential credentials = credentialRepository.findById(user.get().getCredentials().getId())
                    .orElseThrow(() -> new RuntimeException("User not found"));


            inf.setFirstName(user.get().getFirstName());
            inf.setLastName(user.get().getLastName());
            inf.setPhone(user.get().getPhone());
            inf.setAddress(user.get().getAddress());
            inf.setCvBase64(user.get().getCv());
            inf.setEmail(credentials.getEmail());

            return inf;
        }

        throw new RuntimeException("User not found");
    }
}

