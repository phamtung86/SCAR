package com.t2.jwtutils;

import jakarta.persistence.Column;
import jakarta.persistence.Transient;
import lombok.Data;
import lombok.ToString;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;

import java.util.Collection;


@ToString
public class CustomUserDetails extends User {
    private Integer userId;

	private String firstName;

	private String lastName;

	private String fullName;
    
	private String profilePicture;

	public CustomUserDetails(String username, String password, Integer id,String firstName, String lastName,String profilePicture, Collection<? extends GrantedAuthority> authorities) {
		super(username, password, authorities);
		this.userId = id;
		this.firstName = firstName;
		this.lastName = lastName;
		this.fullName = firstName +" "+ lastName;
		this.profilePicture = profilePicture;
	}

	public Integer getUserId() {
		return userId;
	}

	public void setUserId(Integer userId) {
		this.userId = userId;
	}

	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public String getFullName() {
		return fullName;
	}

	public void setFullName(String fullName) {
		this.fullName = fullName;
	}

	public String getProfilePicture() {
		return profilePicture;
	}

	public void setProfilePicture(String profilePicture) {
		this.profilePicture = profilePicture;
	}
}
