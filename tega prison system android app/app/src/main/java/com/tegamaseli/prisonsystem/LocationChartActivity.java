package com.tegamaseli.prisonsystem;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.widget.ImageView;

import com.github.mikephil.charting.charts.LineChart;
import com.github.mikephil.charting.data.Entry;
import com.github.mikephil.charting.data.LineData;
import com.github.mikephil.charting.data.LineDataSet;

import java.util.ArrayList;

public class LocationChartActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_location_chart);
        ImageView imageView=findViewById(R.id.arrowfront);
        imageView.setOnClickListener(v -> {
            startActivity(new Intent(this,GymActivity.class));
        });
        LineChart chart = findViewById(R.id.chart);

        ArrayList<Entry> entries = new ArrayList<>();
        entries.add(new Entry(0, 4));
        entries.add(new Entry(1, 8));
        entries.add(new Entry(2, 6));
        entries.add(new Entry(3, 2));
        entries.add(new Entry(4, 10));

        LineDataSet dataSet = new LineDataSet(entries, "Label");
        LineData lineData = new LineData(dataSet);

        chart.setData(lineData);
        chart.invalidate();
    }
}