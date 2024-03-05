package com.tegamaseli.prisonsystem;

import android.os.Bundle;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.EditText;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

import com.hbb20.CountryCodePicker;
import com.tegamaseli.prisonsystem.Firebase.FirebaseProcesses;

public class CreateAccount extends AppCompatActivity {
    String email;
    String fname;
    String lname;
    String countryCode;
    String number;
    String password;
    Button register;
    String emailPattern = "[a-zA-Z0-9._-]+@[a-z]+\\.+[a-z]+";
    CheckBox checkBox;
    CountryCodePicker countryCodePicker;
    EditText emailtxt,fnametxt,lnametxt,numbertxt,passtxt;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_create_account);
        emailtxt=findViewById(R.id.input_email);
        fnametxt=findViewById(R.id.input_fname);
        lnametxt=findViewById(R.id.input_lname);
        numbertxt=findViewById(R.id.input_number);
        register=findViewById(R.id.btn_register);
        passtxt=findViewById(R.id.input_password);
        countryCodePicker=findViewById(R.id.countryCodePicker);
        checkBox=findViewById(R.id.checkBox);
        register.setOnClickListener(v -> {
            email=emailtxt.getText().toString();
            fname=fnametxt.getText().toString();
            lname=lnametxt.getText().toString();
            number=numbertxt.getText().toString();
            countryCode = countryCodePicker.getSelectedCountryCode();
            password=passtxt.getText().toString();
            if(email.equals("")){
                AllDialogs.showErrorDialog(CreateAccount.this,"Please enter email");
            }
            else if(fname.equals("")){
                AllDialogs.showErrorDialog(CreateAccount.this,"Please enter first name");
            }
            else if(lname.equals("")){
                AllDialogs.showErrorDialog(CreateAccount.this,"Please enter last name");
            }
            else if(number.equals("")){
                AllDialogs.showErrorDialog(CreateAccount.this,"Please enter number");
            }
            else if(password.equals("")){
                AllDialogs.showErrorDialog(CreateAccount.this,"Please enter password");
            } else if (!checkBox.isChecked()) {
                AllDialogs.showErrorDialog(CreateAccount.this,"Please agree to the privacy policy");
            } else{
                Toast.makeText(this, "Please wait", Toast.LENGTH_SHORT).show();
                FileOps fileOps=new FileOps(CreateAccount.this);
                fileOps.writeToIntFile("useremail.txt",email);
                fileOps.writeToIntFile("usernumber.txt",number);
                fileOps.writeToIntFile("usercountrycode.txt",countryCode);
                fileOps.writeToIntFile("userfname.txt",fname);
                fileOps.writeToIntFile("userlname.txt",lname);
                fileOps.writeToIntFile("username.txt",fname+" "+lname);
                FirebaseProcesses.createNewUser(CreateAccount.this,email,password);
            }
        });
    }
}