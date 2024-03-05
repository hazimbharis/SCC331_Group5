package com.tegamaseli.prisonsystem;

public class DataUser {
    String fname;
    String lname;
    String name;
    String profilePhoto;
    String number;
    String countryCode;
    String email;

    public String getFname() {
        return fname;
    }

    public String getLname() {
        return lname;
    }

    public String getName() {
        return name;
    }

    public String getProfilePhoto() {
        return profilePhoto;
    }

    public String getNumber() {
        return number;
    }

    public String getCountryCode() {
        return countryCode;
    }

    public String getEmail() {
        return email;
    }

    public void setFname(String fname) {
        this.fname = fname;
    }

    public void setLname(String lname) {
        this.lname = lname;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setProfilePhoto(String profilePhoto) {
        this.profilePhoto = profilePhoto;
    }

    public void setNumber(String number) {
        this.number = number;
    }

    public void setCountryCode(String countryCode) {
        this.countryCode = countryCode;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
