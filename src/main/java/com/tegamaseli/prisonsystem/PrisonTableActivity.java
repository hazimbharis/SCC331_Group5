package com.tegamaseli.prisonsystem;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;
import android.text.InputType;
import android.widget.TableLayout;
import android.widget.TableRow;
import android.widget.TextView;

import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.ValueEventListener;

public class PrisonTableActivity extends AppCompatActivity {
    ValueEventListener valueEventListener;
    FirebaseDatabase firebaseDatabase;
    DatabaseReference databaseReference;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_table);
        firebaseDatabase = FirebaseDatabase.getInstance();
        databaseReference = firebaseDatabase.getReference("Details");
        TableLayout tableLayout = findViewById(R.id.tableLayout);
        // Create header row
        TableRow headerRow = new TableRow(this);

        // Add column names
        addColumnToRow(headerRow, "Temperature");
        addColumnToRow(headerRow, "Noise");
        addColumnToRow(headerRow, "Light");
        addColumnToRow(headerRow, "Date & Time");

        // Add header row to the table
        tableLayout.addView(headerRow);
        fetchData(tableLayout);
    }

    private void addColumnToRow(TableRow row, String columnName) {
        TextView textView = new TextView(this);
        textView.setText(columnName);
        textView.setPadding(20, 10, 20, 10); // Adjust padding as needed
        row.addView(textView);
    }

    public void fetchData(final TableLayout tableLayout) {
        valueEventListener = new ValueEventListener() {
            @Override
            public void onDataChange(@NonNull DataSnapshot dataSnapshot) {
                // Iterate through the dataSnapshot to get each SensorData object
                for (DataSnapshot snapshot : dataSnapshot.getChildren()) {
                    SensorData sensorData = snapshot.getValue(SensorData.class);
                    // Call a method to populate the table with the retrieved SensorData
                    if (sensorData.getLocation().equalsIgnoreCase("prison")) {
                        populateTableRow(tableLayout, sensorData);
                    }
                }
            }

            @Override
            public void onCancelled(@NonNull DatabaseError databaseError) {
                // Handle database error
            }
        };

        // Add the ValueEventListener to the databaseReference
        databaseReference.addValueEventListener(valueEventListener);
    }

    private void populateTableRow(TableLayout tableLayout, SensorData sensorData) {
        // Create a new row
        TableRow row = new TableRow(PrisonTableActivity.this);

        // Create TextViews for each sensor data value
        TextView temperatureTextView = new TextView(PrisonTableActivity.this);
        temperatureTextView.setPadding(20, 10, 20, 10);
        temperatureTextView.setText(String.valueOf(sensorData.getTemp()));
        TextView noiseTextView = new TextView(PrisonTableActivity.this);
        noiseTextView.setPadding(20, 10, 20, 10);
        noiseTextView.setText(String.valueOf(sensorData.getNoise()));
        TextView lightIntensityTextView = new TextView(PrisonTableActivity.this);
        lightIntensityTextView.setPadding(20, 10, 20, 10);
        lightIntensityTextView.setText(String.valueOf(sensorData.getLight()));
        TextView dateTimeTextView = new TextView(PrisonTableActivity.this);
        dateTimeTextView.setInputType(dateTimeTextView.getInputType() | InputType.TYPE_TEXT_FLAG_MULTI_LINE);
        dateTimeTextView.setPadding(20, 10, 20, 10);
        dateTimeTextView.setText(sensorData.getDatetime());

        // Add TextViews to the row
        row.addView(temperatureTextView);
        row.addView(noiseTextView);
        row.addView(lightIntensityTextView);
        row.addView(dateTimeTextView);

        // Add the row to the table layout
        tableLayout.addView(row);
    }
}