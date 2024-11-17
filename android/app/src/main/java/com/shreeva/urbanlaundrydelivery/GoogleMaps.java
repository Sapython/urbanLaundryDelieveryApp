package com.shreeva.urbanlaundrydelivery;


import android.content.Intent;
import android.net.Uri;
import android.widget.Toast;

import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "GoogleMaps")
public class GoogleMaps extends Plugin {
  @PluginMethod()
  public void openGoogleMap(PluginCall call) throws InterruptedException {
    Toast.makeText(((MainActivity)getActivity()),"Starting", Toast.LENGTH_LONG);
    ((MainActivity)getActivity()).navigateToGoogleMaps(call.getDouble("latitude"),call.getDouble("longitude"));
    call.resolve();
  }
}
