package com.tegamaseli.prisonsystem;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

import com.tegamaseli.prisonsystem.Firebase.FirebaseProcesses;

public class LoginActivity extends AppCompatActivity {
    String email;
    String password;
    EditText emailtxt, passtxt;
    TextView signUp;
    Button btn;
    TextView forgotpass;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);
        //addDatatoFirebasef();
        emailtxt = findViewById(R.id.input_email);
        forgotpass = findViewById(R.id.forgotpass);
        passtxt = findViewById(R.id.input_password);
        signUp = findViewById(R.id.link_signup);
        btn = findViewById(R.id.btn_login);
        forgotpass.setOnClickListener(v -> {
            startActivity(new Intent(this, ResetPasswordActivity.class));
        });
        btn.setOnClickListener(v -> {
            Toast.makeText(LoginActivity.this, "Please wait...", Toast.LENGTH_LONG).show();
            email = emailtxt.getText().toString();
            password = passtxt.getText().toString();
            if (email.equals("")) {
                AllDialogs.showErrorDialog(LoginActivity.this, "Please fill in email");
            } else if (password.equals("")) {
                AllDialogs.showErrorDialog(LoginActivity.this, "Please fill in password");
            } else {
                FirebaseProcesses.logInUser(LoginActivity.this, email, password);
            }
        });
        signUp.setOnClickListener(v -> {
            startActivity(new Intent(this, CreateAccount.class));
        });

    }
}