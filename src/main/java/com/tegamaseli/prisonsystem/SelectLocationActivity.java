package com.tegamaseli.prisonsystem;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;
import android.widget.LinearLayout;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

import com.tegamaseli.prisonsystem.Firebase.FirebaseProcesses;

public class SelectLocationActivity extends AppCompatActivity {
LinearLayout hotelLayout,prisonLayout;
Button logout;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);

        setContentView(R.layout.activity_select_location);
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });
        logout=findViewById(R.id.logoutbtn);
        logout.setOnClickListener(v -> {
            if( FirebaseProcesses.logOutUser()==1){
                startActivity(new Intent(this,LoginActivity.class));
            }
        });
        hotelLayout=findViewById(R.id.hotelLayout);
        prisonLayout=findViewById(R.id.prisonLayout);
        prisonLayout.setOnClickListener(v -> {
            startActivity(new Intent(this,PrisonerPositioningSystemActivity.class));
        });
        hotelLayout.setOnClickListener(v -> {
            startActivity(new Intent(this,HotelPositioningSystemActivity.class));
        });
    }
}