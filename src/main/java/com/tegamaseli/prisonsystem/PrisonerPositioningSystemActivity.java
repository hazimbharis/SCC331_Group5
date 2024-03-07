package com.tegamaseli.prisonsystem;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.widget.ImageView;
import android.widget.Toast;

import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.ValueEventListener;

public class PrisonerPositioningSystemActivity extends AppCompatActivity {
ImageView gym,library,canteen,livingroom,chart;
int REQUEST_LOCATION_PERMISSION=101;
int REQUEST_BLUETOOTH_PERMISSION=102;
SensorData sensorData;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_prisoner_positioning_system);
       // addDatatoFirebasef();
        ImageView imageView=findViewById(R.id.arrowfront);
        imageView.setOnClickListener(v -> {
            startActivity(new Intent(this,LocationChartActivity.class));
        });
        if (ContextCompat.checkSelfPermission(this, android.Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(this, new String[]{android.Manifest.permission.ACCESS_FINE_LOCATION}, REQUEST_LOCATION_PERMISSION);
        }

        if (ContextCompat.checkSelfPermission(this, android.Manifest.permission.BLUETOOTH) != PackageManager.PERMISSION_GRANTED
                || ContextCompat.checkSelfPermission(this, android.Manifest.permission.BLUETOOTH_ADMIN) != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(this, new String[]{android.Manifest.permission.BLUETOOTH, android.Manifest.permission.BLUETOOTH_ADMIN}, REQUEST_BLUETOOTH_PERMISSION);
        }

        gym=findViewById(R.id.gym);
        library=findViewById(R.id.library);
        canteen=findViewById(R.id.canteen);
        livingroom=findViewById(R.id.livingroom);
        chart=findViewById(R.id.chart);
        gym.setOnClickListener(v -> {
            startActivity(new Intent(this,GymActivity.class));
        });
        library.setOnClickListener(v -> {
            startActivity(new Intent(this,LibraryActivity.class));
        });
        canteen.setOnClickListener(v -> {
            startActivity(new Intent(this,CanteenActivity.class));
        });
        livingroom.setOnClickListener(v -> {
            startActivity(new Intent(this,LivingRoomActivity.class));
        });
        chart.setOnClickListener(v -> {
            startActivity(new Intent(this, PrisonTableActivity.class));
        });

    }
    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == REQUEST_LOCATION_PERMISSION) {
            if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                // Permission granted
            } else {
                // Permission denied
            }
        } else if (requestCode == REQUEST_BLUETOOTH_PERMISSION) {
            // Handle Bluetooth permissions similarly
        }
    }
    private void addDatatoFirebasef() {
        sensorData=new SensorData();
        FirebaseDatabase firebaseDatabasedis = FirebaseDatabase.getInstance();
        DatabaseReference databaseReferencedis = firebaseDatabasedis.getReference("Details");
        String key = databaseReferencedis.getKey();
        databaseReferencedis.addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(@NonNull DataSnapshot snapshot) {
                sensorData.setDatetime("20/2/24");
                sensorData.setTemp("34 C");
                sensorData.setNoise("56");
                sensorData.setLight("68");
                databaseReferencedis.child(key).setValue(sensorData);
                Toast.makeText(PrisonerPositioningSystemActivity.this, "added successfully", Toast.LENGTH_SHORT).show();
            }

            @Override
            public void onCancelled(@NonNull DatabaseError error) {

            }
        });
    }
}