package com.tegamaseli.prisonsystem;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Bundle;
import android.widget.TextView;
import androidx.appcompat.app.AppCompatActivity;

public class TestActivity extends AppCompatActivity {

    private TextView temperatureTextView;
    private TextView lightTextView;
    private TextView noiseTextView;

    private BroadcastReceiver radioReceiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            String sensorData = intent.getStringExtra("sensor_data");
            displaySensorData(sensorData);
        }
    };

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_test);

        temperatureTextView = findViewById(R.id.tempTextView);
        lightTextView = findViewById(R.id.lightTextView);
        noiseTextView = findViewById(R.id.noiseTextView);
    }

    @Override
    protected void onResume() {
        super.onResume();
        registerReceiver(radioReceiver, new IntentFilter("radio_data"));
    }

    @Override
    protected void onPause() {
        super.onPause();
        unregisterReceiver(radioReceiver);
    }

    private void displaySensorData(String sensorData) {
        // Parse sensor data and update TextViews
        // Example: "Temp:25C, Light:100, Noise:80"
        String[] dataParts = sensorData.split(", ");
        for (String dataPart : dataParts) {
            String[] keyValue = dataPart.split(":");
            if (keyValue.length == 2) {
                String key = keyValue[0];
                String value = keyValue[1];
                switch (key) {
                    case "Temp":
                        temperatureTextView.setText("Temperature: " + value);
                        break;
                    case "Light":
                        lightTextView.setText("Light: " + value);
                        break;
                    case "Noise":
                        noiseTextView.setText("Noise: " + value);
                        break;
                    default:
                        // Handle unknown key
                        break;
                }
            }
        }
    }
}
