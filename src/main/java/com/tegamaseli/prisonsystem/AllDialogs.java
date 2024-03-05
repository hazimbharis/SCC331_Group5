package com.tegamaseli.prisonsystem;

import android.content.Context;
import android.content.DialogInterface;

import androidx.appcompat.app.AlertDialog;

public class AllDialogs {
    public static void showErrorDialog(Context context,String message){
        AlertDialog.Builder builder=new AlertDialog.Builder(context);
        builder.setTitle("Error");
        builder.setMessage(message);
        builder.setCancelable(false);
        builder.setPositiveButton("OK", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                dialog.cancel();
            }
        });
        AlertDialog dialog= builder.create();
        dialog.show();
    }
    public static void showSuccessDialog(Context context,String message){
        AlertDialog.Builder builder=new AlertDialog.Builder(context);
        builder.setTitle("Success");
        builder.setMessage(message);
        builder.setCancelable(false);
        builder.setPositiveButton("OK", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                dialog.cancel();
            }
        });
        AlertDialog dialog= builder.create();
        dialog.show();
    }

    public static void showGenericDialog(Context context,String title,String message){
        AlertDialog.Builder builder=new AlertDialog.Builder(context);
        builder.setTitle(title);
        builder.setMessage(message);
        builder.setCancelable(false);
        builder.setPositiveButton("OK", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                dialog.cancel();
            }
        });
        AlertDialog dialog= builder.create();
        dialog.show();
    }
}

