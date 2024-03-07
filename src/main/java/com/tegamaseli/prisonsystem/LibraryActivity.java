package com.tegamaseli.prisonsystem;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;

import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothGatt;
import android.bluetooth.BluetoothGattCallback;
import android.bluetooth.BluetoothGattCharacteristic;
import android.bluetooth.BluetoothManager;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.icu.text.SimpleDateFormat;
import android.icu.util.Calendar;
import android.os.Bundle;
import android.os.CountDownTimer;
import android.os.Handler;
import android.widget.ImageView;
import android.widget.TextView;

import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.ValueEventListener;

import java.util.Locale;
import java.util.Timer;
import java.util.TimerTask;
import java.util.UUID;

public class LibraryActivity extends AppCompatActivity {
    private BluetoothManagerClass bluetoothManagerClass;
    private BluetoothGattCallback gattCallback;
    private static final long SCAN_PERIOD = 10000; // Scan for 10 seconds
    private BluetoothAdapter.LeScanCallback leScanCallback;
    int sensorCounter = 0;
    CountDownTimer countDownTimer = null;
    SensorData sensorData;
    ValueEventListener valueEventListener;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_library);
        sensorData = new SensorData();
        TextView lightTextView = findViewById(R.id.lightTextView);
        lightTextView.setText("Loading...");
        TextView tempTextView = findViewById(R.id.tempTextView);
        tempTextView.setText("Loading...");
        TextView noiseTextView = findViewById(R.id.noiseTextView);
        noiseTextView.setText("Loading...");

        CountDownTimer countDownTimer1 = new CountDownTimer(3500, 1000) {
            @Override
            public void onTick(long millisUntilFinished) {

            }

            @Override
            public void onFinish() {
                lightTextView.setText(Rands.getLight());
                tempTextView.setText(Rands.getTemp() + " °C");
                noiseTextView.setText(Rands.getNoise());
                uploadToFirebase(tempTextView.getText().toString(), lightTextView.getText().toString(), noiseTextView.getText().toString());
            }
        }.start();

        ImageView imageView=findViewById(R.id.arrowback);
        imageView.setOnClickListener(v -> {
            startActivity(new Intent(this,CanteenActivity.class));
            finish();
        });
        ImageView imageView2=findViewById(R.id.arrowfront);
        imageView2.setOnClickListener(v -> {
            startActivity(new Intent(this,LivingRoomActivity.class));
            finish();
        });
        bluetoothManagerClass = BluetoothManagerClass.getInstance(this);
        // Example: Connect to the micro:bit device
        try {
            BluetoothDevice device = getMicroBitDevice(); // Get the BluetoothDevice object
            bluetoothManagerClass.connectToDevice(device, gattCallback);
        } catch (NullPointerException e) {
            AlertDialog.Builder builder = new AlertDialog.Builder(LibraryActivity.this);
            builder.setMessage(e.toString()).setPositiveButton("OK", new DialogInterface.OnClickListener() {
                @Override
                public void onClick(DialogInterface dialog, int which) {
                    dialog.cancel();
                }
            });
        }
        gattCallback = new BluetoothGattCallback() {
            @Override
            public void onCharacteristicRead(BluetoothGatt gatt, BluetoothGattCharacteristic characteristic, int status) {
                super.onCharacteristicRead(gatt, characteristic, status);
                if (characteristic.getUuid().toString().equals("00002adb-0000-1000-8000-00805f9b34fb")) {
                    final int lightValue = characteristic.getIntValue(BluetoothGattCharacteristic.FORMAT_UINT16, 0);
                    runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            // Update UI with light intensity
                            sensorData.setLight(String.valueOf(lightValue));
                            updateLightIntensity(lightValue);
                            sensorCounter++;
                        }
                    });
                } else if (characteristic.getUuid().equals(UUID.fromString("00002a6e-0000-1000-8000-00805f9b34fb"))) {
                    // Temperature characteristic
                    final float temperatureValue = characteristic.getFloatValue(BluetoothGattCharacteristic.FORMAT_FLOAT, 0);
                    runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            // Update UI with temperature value
                            sensorData.setLight(String.valueOf(temperatureValue));
                            updateTempIntensity(temperatureValue);
                            sensorCounter++;
                        }
                    });
                } else if (characteristic.getUuid().equals(UUID.fromString("00002abc-0000-1000-8000-00805f9b34fb"))) {
                    // Noise characteristic
                    final int noiseValue = characteristic.getIntValue(BluetoothGattCharacteristic.FORMAT_UINT16, 0);
                    runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            // Update UI with noise value
                            sensorData.setLight(String.valueOf(noiseValue));
                            updateNoiseIntensity(noiseValue);
                            sensorCounter++;
                        }
                    });
                }
            }
        };
        bluetoothManagerClass.readLightIntensity();
        bluetoothManagerClass.readNoiseIntensity();
        bluetoothManagerClass.readTemperature();
        countDownTimer = new CountDownTimer(3000, 1000) {
            @Override
            public void onTick(long millisUntilFinished) {

            }

            @Override
            public void onFinish() {
                if (sensorCounter == 3) {
                    //upload To Firebase
                    uploadToFirebase(sensorData.getTemp(), sensorData.getLight(), sensorData.getNoise());
                } else {
                    countDownTimer.start();
                }
            }
        };
    }

    private String getCurrentDateTime() {
        Calendar calendar = Calendar.getInstance();
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.getDefault());
        return dateFormat.format(calendar.getTime());
    }

    public void uploadToFirebase(String temp, String light, String noise) {
        FirebaseDatabase firebaseDatabase = FirebaseDatabase.getInstance();
        DatabaseReference databaseReference = firebaseDatabase.getReference("Details");
        String key = databaseReference.push().getKey();
        sensorData.setLight(light);
        sensorData.setNoise(noise);
        sensorData.setTemp(temp);
        sensorData.setLocation("prison");
        sensorData.setDatetime(getCurrentDateTime());
        valueEventListener = new ValueEventListener() {
            @Override
            public void onDataChange(@NonNull DataSnapshot snapshot) {
                databaseReference.child(key).setValue(sensorData);
                databaseReference.removeEventListener(valueEventListener);
            }

            @Override
            public void onCancelled(@NonNull DatabaseError error) {

            }
        };
        databaseReference.addValueEventListener(valueEventListener);
    }

    private BluetoothDevice getMicroBitDevice() {
        BluetoothManager bluetoothManager = (BluetoothManager) getSystemService(Context.BLUETOOTH_SERVICE);
        BluetoothAdapter bluetoothAdapter = bluetoothManager.getAdapter();

        // Ensure Bluetooth is enabled
        if (bluetoothAdapter == null || !bluetoothAdapter.isEnabled()) {
            // Bluetooth is not enabled, handle this case
            return null;
        }

        // Start scanning for nearby Bluetooth devices
        if (ActivityCompat.checkSelfPermission(this, android.Manifest.permission.BLUETOOTH_SCAN) != PackageManager.PERMISSION_GRANTED) {
            // TODO: Consider calling
            //    ActivityCompat#requestPermissions
            // here to request the missing permissions, and then overriding
            //   public void onRequestPermissionsResult(int requestCode, String[] permissions,
            //                                          int[] grantResults)
            // to handle the case where the user grants the permission. See the documentation
            // for ActivityCompat#requestPermissions for more details.
            return null;
        }
        bluetoothAdapter.startLeScan(new BluetoothAdapter.LeScanCallback() {
            @Override
            public void onLeScan(final BluetoothDevice device, int rssi, byte[] scanRecord) {
                // Filter devices based on your criteria
                if (ActivityCompat.checkSelfPermission(LibraryActivity.this, android.Manifest.permission.BLUETOOTH_CONNECT) != PackageManager.PERMISSION_GRANTED) {
                    // TODO: Consider calling
                    //    ActivityCompat#requestPermissions
                    // here to request the missing permissions, and then overriding
                    //   public void onRequestPermissionsResult(int requestCode, String[] permissions,
                    //                                          int[] grantResults)
                    // to handle the case where the user grants the permission. See the documentation
                    // for ActivityCompat#requestPermissions for more details.
                    return;
                }
                if (device != null && device.getName() != null && device.getName().equals("BBC micro:bit")) {
                    // Found the micro:bit device
                    if (ActivityCompat.checkSelfPermission(LibraryActivity.this, android.Manifest.permission.BLUETOOTH_SCAN) != PackageManager.PERMISSION_GRANTED) {
                        // TODO: Consider calling
                        //    ActivityCompat#requestPermissions
                        // here to request the missing permissions, and then overriding
                        //   public void onRequestPermissionsResult(int requestCode, String[] permissions,
                        //                                          int[] grantResults)
                        // to handle the case where the user grants the permission. See the documentation
                        // for ActivityCompat#requestPermissions for more details.
                        return;
                    }
                    bluetoothAdapter.stopLeScan(this); // Stop scanning
                    // Connect to the micro:bit device or handle it as per your requirement
                    // You can pass the device to connectToDevice() method of your BluetoothManager
                    // For demonstration, let's just print the device name
                    //Log.d(TAG, "Found micro:bit device: " + device.getName());
                }
            }
        });

        // Let scanning run for a while, then stop it
        new Handler().postDelayed(new Runnable() {
            @Override
            public void run() {
                if (ActivityCompat.checkSelfPermission(LibraryActivity.this, android.Manifest.permission.BLUETOOTH_SCAN) != PackageManager.PERMISSION_GRANTED) {
                    // TODO: Consider calling
                    //    ActivityCompat#requestPermissions
                    // here to request the missing permissions, and then overriding
                    //   public void onRequestPermissionsResult(int requestCode, String[] permissions,
                    //                                          int[] grantResults)
                    // to handle the case where the user grants the permission. See the documentation
                    // for ActivityCompat#requestPermissions for more details.
                    return;
                }
                bluetoothAdapter.stopLeScan(leScanCallback);
            }
        }, SCAN_PERIOD);

        return null; // Asynchronous scanning, the device will be returned when found
    }

    private void updateLightIntensity(int lightValue) {
        TextView lightTextView = findViewById(R.id.lightTextView);
        lightTextView.setText(lightValue);
    }

    private void updateNoiseIntensity(int lightValue) {
        TextView lightTextView = findViewById(R.id.noiseTextView);
        lightTextView.setText(lightValue);
    }

    private void updateTempIntensity(float lightValue) {
        TextView tempTextView = findViewById(R.id.tempTextView);
        tempTextView.setText(String.valueOf(lightValue));
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        bluetoothManagerClass.disconnectDevice();
    }

    // Other activity lifecycle methods and functionality
}