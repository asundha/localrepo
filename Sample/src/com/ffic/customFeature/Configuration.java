package com.ffic.customFeature;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import com.ibm.json.java.JSONArray;
import com.ibm.json.java.JSONObject;

/**
 * Provides a simple wrapper around loaded configuration for the plugin
 * 
 * @author Michael Oland, Philip Jacob
 *
 */
public class Configuration
{
	
	private static long lastLoaded = -1;
	private static String rediHost,password,downloadLocation;
	private static ArrayList<String> hideredisColumns;
	
	public static ArrayList<String> getHideredisColumns() {
		return hideredisColumns;
	}





	public static String getDownloadLocation() {
		return downloadLocation;
	}



	private static int port;
	
	
	
	public static String getRedisHost() {
		return rediHost;
	}



	

	public static String getPassword() {
		return password;
	}



	



	public static int getPort() {
		return port;
	}



	

//reding data from JSON object
	public static void loadConfiguration(JSONObject object)
	{
		Configuration.rediHost = (String)object.get("redisHost");
		Configuration.port=Integer.parseInt((String) object.get("redisPort"));
		Configuration.password=(String)object.get("redisPwd");
		Configuration.downloadLocation=(String)object.get("reconciliationReport");
		String hidecolumns=(String)object.get("hide_redis_columns");
		String[] columns=hidecolumns.split(";");
		//System.out.println("the columns is"+columns.length);
		hideredisColumns=new ArrayList<String>();
		for(String s:columns)
		{
		Configuration.hideredisColumns.add(s);
		}
		Configuration.lastLoaded = System.currentTimeMillis();
	}
	
	

	public static final long getLastLoaded()
	{
		return lastLoaded;
	}

	

	

	
}
