package com.tegamaseli.prisonsystem;

import android.os.Bundle;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

import com.tegamaseli.prisonsystem.Firebase.FirebaseProcesses;


public class ResetPasswordActivity extends AppCompatActivity {
    EditText emailEditText;
    Button submit;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_reset_password);
        emailEditText=findViewById(R.id.emailedittext);
        submit=findViewById(R.id.resetbtn);
        submit.setOnClickListener(v -> {
            Toast.makeText(this, "Please wait...", Toast.LENGTH_SHORT).show();
            String email=emailEditText.getText().toString();
            FirebaseProcesses.sendPasswordResetLink(ResetPasswordActivity.this,email);
        });
    }
}