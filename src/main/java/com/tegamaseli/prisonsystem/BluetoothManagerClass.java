package com.tegamaseli.prisonsystem;

import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothGatt;
import android.bluetooth.BluetoothGattCallback;
import android.bluetooth.BluetoothGattCharacteristic;
import android.bluetooth.BluetoothGattService;
import android.bluetooth.BluetoothManager;
import android.content.Context;
import android.content.pm.PackageManager;

import androidx.core.app.ActivityCompat;

import java.util.UUID;

public class BluetoothManagerClass {
    private static final String TAG = "BluetoothManager";

    private static BluetoothManagerClass instance;
    private Context context;
    private BluetoothAdapter bluetoothAdapter;
    private BluetoothGatt bluetoothGatt;
    private BluetoothGattCallback gattCallback;

    private BluetoothManagerClass(Context context) {
        this.context = context;
        BluetoothManager bluetoothManagerClass = (BluetoothManager) context.getSystemService(Context.BLUETOOTH_SERVICE);
        bluetoothAdapter = bluetoothManagerClass.getAdapter();
    }

    public static BluetoothManagerClass getInstance(Context context) {
        if (instance == null) {
            instance = new BluetoothManagerClass(context);
        }
        return instance;
    }

    public void connectToDevice(BluetoothDevice device, BluetoothGattCallback callback) {
        if (bluetoothGatt != null) {
            if (ActivityCompat.checkSelfPermission(context, android.Manifest.permission.BLUETOOTH_CONNECT) != PackageManager.PERMISSION_GRANTED) {
                // TODO: Consider calling
                //    ActivityCompat#requestPermissions
                // here to request the missing permissions, and then overriding
                //   public void onRequestPermissionsResult(int requestCode, String[] permissions,
                //                                          int[] grantResults)
                // to handle the case where the user grants the permission. See the documentation
                // for ActivityCompat#requestPermissions for more details.
                return;
            }
            bluetoothGatt.close();
        }
        gattCallback = callback;
        bluetoothGatt = device.connectGatt(context, false, gattCallback);
    }

    public void disconnectDevice() {
        if (bluetoothGatt != null) {
            if (ActivityCompat.checkSelfPermission(context, android.Manifest.permission.BLUETOOTH_CONNECT) != PackageManager.PERMISSION_GRANTED) {
                // TODO: Consider calling
                //    ActivityCompat#requestPermissions
                // here to request the missing permissions, and then overriding
                //   public void onRequestPermissionsResult(int requestCode, String[] permissions,
                //                                          int[] grantResults)
                // to handle the case where the user grants the permission. See the documentation
                // for ActivityCompat#requestPermissions for more details.
                return;
            }
            bluetoothGatt.disconnect();
            bluetoothGatt.close();
            bluetoothGatt = null;
        }
    }

    public void readLightIntensity() {
        if (bluetoothGatt != null) {
            BluetoothGattService service = bluetoothGatt.getService(UUID.fromString("00001adc-0000-1000-8000-00805f9b34fb")); // LED Service
            if (service != null) {
                BluetoothGattCharacteristic lightCharacteristic = service.getCharacteristic(UUID.fromString("00002adb-0000-1000-8000-00805f9b34fb")); // Light Characteristic
                if (lightCharacteristic != null) {
                    if (ActivityCompat.checkSelfPermission(context, android.Manifest.permission.BLUETOOTH_CONNECT) != PackageManager.PERMISSION_GRANTED) {
                        // TODO: Consider calling
                        //    ActivityCompat#requestPermissions
                        // here to request the missing permissions, and then overriding
                        //   public void onRequestPermissionsResult(int requestCode, String[] permissions,
                        //                                          int[] grantResults)
                        // to handle the case where the user grants the permission. See the documentation
                        // for ActivityCompat#requestPermissions for more details.
                        return;
                    }
                    bluetoothGatt.readCharacteristic(lightCharacteristic);
                }
            }
        }
    }

    public void readNoiseIntensity() {
        if (bluetoothGatt != null) {
            BluetoothGattService service = bluetoothGatt.getService(UUID.fromString("00001abc-0000-1000-8000-00805f9b34fb")); // Noise Service
            if (service != null) {
                BluetoothGattCharacteristic noiseCharacteristic = service.getCharacteristic(UUID.fromString("00002abc-0000-1000-8000-00805f9b34fb")); // Noise Characteristic
                if (noiseCharacteristic != null) {
                    if (ActivityCompat.checkSelfPermission(context, android.Manifest.permission.BLUETOOTH_CONNECT) != PackageManager.PERMISSION_GRANTED) {
                        // TODO: Consider calling
                        //    ActivityCompat#requestPermissions
                        // here to request the missing permissions, and then overriding
                        //   public void onRequestPermissionsResult(int requestCode, String[] permissions,
                        //                                          int[] grantResults)
                        // to handle the case where the user grants the permission. See the documentation
                        // for ActivityCompat#requestPermissions for more details.
                        return;
                    }
                    bluetoothGatt.readCharacteristic(noiseCharacteristic);
                }
            }
        }
    }

    public void readTemperature() {
        if (bluetoothGatt != null) {
            BluetoothGattService service = bluetoothGatt.getService(UUID.fromString("0000180F-0000-1000-8000-00805f9b34fb")); // Environmental Sensing Service
            if (service != null) {
                BluetoothGattCharacteristic temperatureCharacteristic = service.getCharacteristic(UUID.fromString("00002A6E-0000-1000-8000-00805f9b34fb")); // Temperature Characteristic
                if (temperatureCharacteristic != null) {
                    if (ActivityCompat.checkSelfPermission(context, android.Manifest.permission.BLUETOOTH_CONNECT) != PackageManager.PERMISSION_GRANTED) {
                        // TODO: Consider calling
                        //    ActivityCompat#requestPermissions
                        // here to request the missing permissions, and then overriding
                        //   public void onRequestPermissionsResult(int requestCode, String[] permissions,
                        //                                          int[] grantResults)
                        // to handle the case where the user grants the permission. See the documentation
                        // for ActivityCompat#requestPermissions for more details.
                        return;
                    }
                    bluetoothGatt.readCharacteristic(temperatureCharacteristic);
                }
            }
        }
    }

    // Add methods for handling Bluetooth operations, such as reading characteristics, etc.
}

