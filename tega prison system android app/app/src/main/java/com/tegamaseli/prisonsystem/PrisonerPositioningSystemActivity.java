package com.tegamaseli.prisonsystem;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.widget.ImageView;

public class PrisonerPositioningSystemActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_prisoner_positioning_system);
        ImageView imageView=findViewById(R.id.arrowfront);
        imageView.setOnClickListener(v -> {
            startActivity(new Intent(this,LocationChartActivity.class));
        });
    }
}