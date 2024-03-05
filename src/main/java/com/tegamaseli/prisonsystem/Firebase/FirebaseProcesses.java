package com.tegamaseli.prisonsystem.Firebase;

import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AlertDialog;

import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.auth.AuthResult;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.Query;
import com.google.firebase.database.ValueEventListener;
import com.tegamaseli.prisonsystem.AllDialogs;
import com.tegamaseli.prisonsystem.CreateAccount;
import com.tegamaseli.prisonsystem.DataUser;
import com.tegamaseli.prisonsystem.FileOps;
import com.tegamaseli.prisonsystem.LoginActivity;
import com.tegamaseli.prisonsystem.SelectLocationActivity;

public class FirebaseProcesses {
    static DataUser dataUser;
    static ValueEventListener valueEventListener;
    static boolean state;
    static boolean statee = true;

    public static void logInUser(Context context, String email, String password) {
        try {
            FirebaseAuth auth = FirebaseAuth.getInstance();
            auth.signInWithEmailAndPassword(email, password).addOnCompleteListener(new OnCompleteListener<AuthResult>() {
                @Override
                public void onComplete(@NonNull Task<AuthResult> task) {
                    if (task.isSuccessful()) {
                        FirebaseUser user = auth.getCurrentUser();
                        if (user != null) {
                            if (!user.isEmailVerified()) {
                                AlertDialog.Builder builder = new AlertDialog.Builder(context);
                                builder.setTitle("Verify Email");
                                builder.setMessage("Please verify your email");
                                builder.setCancelable(false);
                                builder.setPositiveButton("OK", new DialogInterface.OnClickListener() {
                                    @Override
                                    public void onClick(DialogInterface dialog, int which) {
                                        dialog.cancel();
                                    }
                                }).setNegativeButton("Resend Email", new DialogInterface.OnClickListener() {
                                    @Override
                                    public void onClick(DialogInterface dialog, int which) {
                                        user.sendEmailVerification().addOnCompleteListener(new OnCompleteListener<Void>() {
                                            @Override
                                            public void onComplete(@NonNull Task<Void> task) {
                                                AlertDialog.Builder builder1 = new AlertDialog.Builder(context);
                                                builder1.setTitle("Email Sent")
                                                        .setMessage("Email sent, use that to verify your account")
                                                        .setCancelable(false)
                                                        .setPositiveButton("Ok", new DialogInterface.OnClickListener() {
                                                            @Override
                                                            public void onClick(DialogInterface dialog, int which) {
                                                                dialog.cancel();
                                                            }
                                                        });
                                                AlertDialog alertDialog = builder1.create();
                                                alertDialog.show();
                                            }
                                        });
                                    }
                                });
                                AlertDialog alertDialog = builder.create();
                                alertDialog.show();
                            } else {
                                FileOps fileOps = new FileOps(context);
                                getUserDetails(context, email);
                                //save all details to users database
                                context.startActivity(new Intent(context, SelectLocationActivity.class).addFlags(Intent.FLAG_ACTIVITY_CLEAR_TASK | Intent.FLAG_ACTIVITY_NEW_TASK));
                            }

                        }
                    } else if (task.getException().getMessage().contains("There is no user record corresponding to this identifier") || task.getException().getMessage().contains("The supplied auth credential is incorrect, malformed or has expired")) {
                        AllDialogs.showErrorDialog(context, "This email does not exist");
                    } else if (task.getException().getMessage().contains("The password is invalid")) {

                        AllDialogs.showErrorDialog(context, "The password is invalid");
                    } else if (task.getException().getMessage().contains("network error")) {
                        AlertDialog.Builder builder = new AlertDialog.Builder(context);
                        builder.setTitle("Network Problems")
                                .setMessage("Please check your network connection")
                                .setPositiveButton("OK", (dialog, id) -> {
                                    dialog.cancel();
                                });
                        AlertDialog dialog = builder.create();
                        dialog.show();
                    } else {
                        AlertDialog.Builder builder = new AlertDialog.Builder(context);
                        builder.setTitle("Error")
                                .setMessage(task.getException().getMessage())
                                .setPositiveButton("OK", (dialog, id) -> {
                                    dialog.cancel();
                                });
                        AlertDialog dialog = builder.create();
                        dialog.show();
                        //Toast.makeText(LoginActivity.this, task.getException().getMessage(), Toast.LENGTH_SHORT).show();
                    }
                }
            });
        } catch (Exception e) {
            Toast.makeText(context, e.toString(), Toast.LENGTH_SHORT).show();
        }

    }

    public static int logOutUser() {
        FirebaseAuth firebaseAuth=FirebaseAuth.getInstance();
        firebaseAuth.signOut();
        FirebaseUser firebaseUser=firebaseAuth.getCurrentUser();
        if(firebaseUser==null){
            return 1;
        }
        return 0;
    }

    public static void sendVerificationEmail(Context context, String email) {
        FirebaseAuth mAuth = FirebaseAuth.getInstance();
        mAuth.sendPasswordResetEmail(email).addOnCompleteListener(new OnCompleteListener<Void>() {
            @Override
            public void onComplete(@NonNull Task<Void> task) {
                if (task.isSuccessful()) {
                    // if isSuccessful then done message will be shown
                    // and you can change the password
                    AlertDialog.Builder builder = new AlertDialog.Builder(context);
                    builder.setTitle("Verify Email")
                            .setMessage("If this email account exists, you would receive an email shortly")
                            .setPositiveButton("OK", (dialog, id) -> {
                                dialog.cancel();
                                context.startActivity(new Intent(context, LoginActivity.class));
                            });
                    AlertDialog dialog = builder.create();
                    dialog.show();
                } else if (task.getException().getMessage().contains("There is no user record corresponding to this identifier")) {
                    AlertDialog.Builder builder = new AlertDialog.Builder(context);
                    builder.setTitle("Invalid Email")
                            .setMessage("This email account does not exist, please check the email and try again")
                            .setPositiveButton("Sign Up", (dialog, id) -> {
                                dialog.cancel();
                                context.startActivity(new Intent(context, CreateAccount.class));
                            })
                            .setNegativeButton("Cancel", (dialog, id) -> {
                                dialog.cancel();
                            });
                    AlertDialog dialog = builder.create();
                    dialog.show();
                } else {
                    Toast.makeText(context, task.getException().getMessage(), Toast.LENGTH_LONG).show();
                }
            }
        }).addOnFailureListener(new OnFailureListener() {
            @Override
            public void onFailure(@NonNull Exception e) {
                //Toast.makeText(ResetPasswordActivity.this,"Error Failed",Toast.LENGTH_LONG).show();
            }
        });
    }

    public static void sendPasswordResetLink(Context context, String email) {
        FirebaseAuth auth = FirebaseAuth.getInstance();
        auth.sendPasswordResetEmail(email).addOnCompleteListener(new OnCompleteListener<Void>() {
            @Override
            public void onComplete(@NonNull Task<Void> task) {
                AlertDialog.Builder builder = new AlertDialog.Builder(context);
                builder.setTitle("Email sent")
                        .setMessage("Password reset email has been sent to your mail box")
                        .setCancelable(true)
                        .setPositiveButton("OK", new DialogInterface.OnClickListener() {
                            @Override
                            public void onClick(DialogInterface dialog, int which) {
                                dialog.cancel();
                            }
                        });
                AlertDialog alertDialog = builder.create();
                alertDialog.show();
            }
        });
    }

    public static void getUserDetails(Context context, String email) {
        DatabaseReference usersRef = FirebaseDatabase.getInstance().getReference().child("Users");
        FileOps fileOps = new FileOps(context);
        Query query = usersRef.orderByChild("email").equalTo(email);
        query.addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(DataSnapshot dataSnapshot) {
                // Iterate through the results
                for (DataSnapshot snapshot : dataSnapshot.getChildren()) {
                    dataUser = snapshot.getValue(DataUser.class);
                    fileOps.writeToIntFile("useremail.txt", dataUser.getEmail());
                    fileOps.writeToIntFile("username.txt", dataUser.getName());
                    fileOps.writeToIntFile("userfname.txt", dataUser.getFname());
                    fileOps.writeToIntFile("userlname.txt", dataUser.getLname());
                    fileOps.writeToIntFile("profileimage.txt", dataUser.getProfilePhoto());
                    fileOps.writeToIntFile("usernumber.txt", dataUser.getNumber());
                    fileOps.writeToIntFile("usercountrycode.txt", dataUser.getCountryCode());
                    fileOps.writeToIntFile("notif.txt", "1");
                }
            }

            @Override
            public void onCancelled(DatabaseError databaseError) {
                // Handle any errors that may occur
                System.out.println("Error: " + databaseError.getMessage());
            }
        });

    }

    public static void createNewUser(Context context, String email, String password) {
        try {
            FirebaseAuth auth = FirebaseAuth.getInstance();
            auth.createUserWithEmailAndPassword(email, password).addOnCompleteListener(new OnCompleteListener<AuthResult>() {
                @Override
                public void onComplete(@NonNull Task<AuthResult> task) {

                    if (task.isSuccessful()) {
                        Toast.makeText(context, "Account Created Successfully", Toast.LENGTH_SHORT).show();
                        FirebaseUser user = auth.getCurrentUser();
                        if (user != null) {
                            if (!user.isEmailVerified()) {
                                user.sendEmailVerification().addOnCompleteListener(new OnCompleteListener<Void>() {
                                    @Override
                                    public void onComplete(@NonNull Task<Void> task) {
                                        if (task.isSuccessful()) {
                                            writeUserDetails(context, email);
                                            AlertDialog.Builder builder = new AlertDialog.Builder(context);
                                            builder.setTitle("Verify Email")
                                                    .setCancelable(false)
                                                    .setMessage("We sent you an email, please use that to verify your account")
                                                    .setPositiveButton("OK", new DialogInterface.OnClickListener() {
                                                        @Override
                                                        public void onClick(DialogInterface dialog, int which) {
                                                            context.startActivity(new Intent(context, LoginActivity.class));
                                                        }
                                                    });
                                            AlertDialog alertDialog = builder.create();
                                            alertDialog.show();
                                        }
                                    }
                                });
                            }
                        }

                    } else if (task.getException().getMessage().contains("The email address is already in use by another account")) {
                        AlertDialog.Builder builder = new AlertDialog.Builder(context);
                        builder.setTitle("Invalid Email").setMessage("This email account exists already").setPositiveButton("Log In", (dialog, id) -> {
                            dialog.cancel();
                            context.startActivity(new Intent(context, LoginActivity.class));
                        }).setNegativeButton("Cancel", (dialog, id) -> {
                            dialog.cancel();
                        });
                        AlertDialog dialog = builder.create();
                        dialog.show();
                    } else if (task.getException().getMessage().contains("Password should be at least 6 characters")) {
                        AlertDialog.Builder builder = new AlertDialog.Builder(context);
                        builder.setTitle("Invalid Password").setMessage("Password should be at least 6 characters").setPositiveButton("OK", (dialog, id) -> {
                            dialog.cancel();
                        });
                        AlertDialog dialog = builder.create();
                        dialog.show();
                    } else {
                        Toast.makeText(context, task.getException().getMessage(), Toast.LENGTH_SHORT).show();
                    }
                }
            });
        } catch (Exception e) {
            Toast.makeText(context, e.toString(), Toast.LENGTH_SHORT).show();
        }
    }

    public static void writeUserDetails(Context context, String email) {
        FileOps fileOps = new FileOps(context);
        Toast.makeText(context, "Please wait", Toast.LENGTH_SHORT).show();
        String name = fileOps.readIntStorage("username.txt");

        FirebaseDatabase firebaseDatabase1 = FirebaseDatabase.getInstance();
        DatabaseReference databaseReference1 = firebaseDatabase1.getReference("Users");
        String key = databaseReference1.push().getKey();
        state = true;
        valueEventListener = new ValueEventListener() {
            @Override
            public void onDataChange(@NonNull DataSnapshot dataSnapshot) {
                for (DataSnapshot snapshot : dataSnapshot.getChildren()) {
                    dataUser = snapshot.getValue(DataUser.class);
                    if (dataUser != null) {
                        if (dataUser.getEmail().equals(email)) {
                            state = true;
                            fileOps.writeToIntFile("useremail.txt", dataUser.getEmail());
                            fileOps.writeToIntFile("username.txt", dataUser.getName());
                            fileOps.writeToIntFile("userfname.txt", dataUser.getFname());
                            fileOps.writeToIntFile("userlname.txt", dataUser.getLname());
                            fileOps.writeToIntFile("profileimage.txt", dataUser.getProfilePhoto());
                            fileOps.writeToIntFile("usercountrycode.txt", dataUser.getCountryCode());
                            fileOps.writeToIntFile("usernumber.txt", dataUser.getNumber());
                            fileOps.writeToIntFile("notif.txt", "1");
                            break;
                        } else {
                            state = false;
                        }
                    }
                }
                if (!state & statee) {
                    dataUser.setEmail(email);
                    dataUser.setName(name);
                    dataUser.setNumber(fileOps.readIntStorage("usercountrycode.txt") + fileOps.readIntStorage("usernumber.txt"));

                    dataUser.setFname(fileOps.readIntStorage("userfname.txt"));
                    dataUser.setLname(fileOps.readIntStorage("userlname.txt"));
                    databaseReference1.child(key).setValue(dataUser);
                    statee = false;
                    databaseReference1.removeEventListener(valueEventListener);
                    AlertDialog.Builder builder = new AlertDialog.Builder(context);
                    builder.setTitle("Verify Email").setMessage("You would receive an email shortly, please use that to set your password and log in to your account").setPositiveButton("OK", (dialog, id) -> {
                        context.startActivity(new Intent(context, LoginActivity.class).addFlags(Intent.FLAG_ACTIVITY_CLEAR_TASK));
                        dialog.cancel();

                    });
                    AlertDialog dialog = builder.create();
                    dialog.show();
                }
            }

            @Override
            public void onCancelled(@NonNull DatabaseError error) {
            }
        };
        databaseReference1.addValueEventListener(valueEventListener);
    }
}
