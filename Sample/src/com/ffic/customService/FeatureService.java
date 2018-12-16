package com.ffic.customService;

import java.io.OutputStream;
import java.io.Writer;
import java.net.InetAddress;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Set;
import java.util.TreeMap;
import java.util.concurrent.TimeUnit;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;






















import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;
import redis.clients.jedis.JedisPoolConfig;
import redis.clients.jedis.SortingParams;

import com.ffic.customFeature.Configuration;
import com.ffic.customFeature.RedisColumns;
import com.ibm.ecm.extension.PluginResponseUtil;
import com.ibm.ecm.extension.PluginService;
import com.ibm.ecm.extension.PluginServiceCallbacks;
import com.ibm.ecm.json.JSONResponse;
import com.ibm.json.java.JSONArray;
import com.ibm.json.java.JSONObject;
import com.ibm.json.java.OrderedJSONObject;

/**
 * Provides an abstract class that is extended to create a class implementing
 * each service provided by the plug-in. Services are actions, similar to
 * servlets or Struts actions, that perform operations on the IBM Content
 * Navigator server. A service can access content server application programming
 * interfaces (APIs) and Java EE APIs.
 * <p>
 * Services are invoked from the JavaScript functions that are defined for the
 * plug-in by using the <code>ecm.model.Request.invokePluginService</code>
 * function.
 * </p>
 * Follow best practices for servlets when implementing an IBM Content Navigator
 * plug-in service. In particular, always assume multi-threaded use and do not
 * keep unshared information in instance variables.
 */
public class FeatureService extends PluginService {

	//public static final String HOST="10.240.6.140";
	//public static final int PORT=6379;
	//public static final String PWD="password";
	/**
	 * Returns the unique identifier for this service.
	 * <p>
	 * <strong>Important:</strong> This identifier is used in URLs so it must
	 * contain only alphanumeric characters.
	 * </p>
	 * 
	 * @return A <code>String</code> that is used to identify the service.
	 */
	public String getId() {
		return "FeatureService";
	}

	/**
	 * Returns the name of the IBM Content Navigator service that this service
	 * overrides. If this service does not override an IBM Content Navigator
	 * service, this method returns <code>null</code>.
	 * 
	 * @returns The name of the service.
	 */
	public String getOverriddenService() {
		return null;
	}

	/**
	 * Performs the action of this service.
	 * 
	 * @param callbacks
	 *            An instance of the <code>PluginServiceCallbacks</code> class
	 *            that contains several functions that can be used by the
	 *            service. These functions provide access to the plug-in
	 *            configuration and content server APIs.
	 * @param request
	 *            The <code>HttpServletRequest</code> object that provides the
	 *            request. The service can access the invocation parameters from
	 *            the request.
	 * @param response
	 *            The <code>HttpServletResponse</code> object that is generated
	 *            by the service. The service can get the output stream and
	 *            write the response. The response must be in JSON format.
	 * @throws Exception
	 *             For exceptions that occur when the service is running. If the
	 *             logging level is high enough to log errors, information about
	 *             the exception is logged by IBM Content Navigator.
	 */
	public void execute(PluginServiceCallbacks callbacks,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		
		
		
		try
		{
		
			
		//System.out.println("request Paramter"+request.getParameterMap());
		
		JSONResponse jresp=new JSONResponse();
		String fetch=request.getParameter("fetchtype");
		System.out.println("Fetchtype in servlet"+fetch);
		if(fetch.equalsIgnoreCase("all"))
		jresp=getData(request);
		
			
		System.out.println("Response Before writing into call"+jresp);
		
		
		PluginResponseUtil.writeJSONResponse(request, response,jresp, callbacks, "FeatureService");
		
		}
		catch(Exception e)
		{
			System.out.println("Exception in  Dashboard Service"+e.getMessage());
		}
		
	
	}
	
	public JSONResponse getData(HttpServletRequest values)
	{
		JSONResponse jresp=new JSONResponse();
		InetAddress ip=null;
		String hostname=null;
		RedisColumns rs=new RedisColumns();
		try{
			Jedis jed=new Jedis(Configuration.getRedisHost(), Configuration.getPort());
			jed.auth(Configuration.getPassword());
			//JSONResponse jresp=new JSONResponse();
			String[] s=rs.getColumns();
			
			
			
			
		

			//System.out.println("Checking the Connection status=>"+jed.ping());
			
			JSONArray jobj=new JSONArray();
			 OrderedJSONObject kvp = null;
			int id=0;
		
			//Set<String> keys=jed.keys("util:*");
			long count=0;
			Long len=jed.llen("HashKeys");
			while(count<len)
			{ 
				String hashkey=jed.lpop("HashKeys");
				//checking whether the key exists or not
				if(jed.hexists(hashkey, s[0]))
				{
				jed.rpush("HashKeys", hashkey);
				len--;
				}
				Map<String,String> map=jed.hgetAll(hashkey);
				kvp=new OrderedJSONObject();
				//String st=Integer.toString(id++);
				id=id+1;
				kvp.put("id", id);
				
					for(String i:s)
					{
						try{
						if("Start Time".equalsIgnoreCase(i) ||"End Time".equalsIgnoreCase(i))
						{
							
							String ds=map.get(i);
						
							Date d=new SimpleDateFormat("EEE MMM dd HH:mm:ss ZZZZ yyyy").parse(ds);
							SimpleDateFormat sf=new SimpleDateFormat("MM/dd/yyyy hh:mm:ss a");
							kvp.put(i,sf.format(d));
							//kvp.put(i, sf.format(d));
							
						}
						else if("Total Time".equalsIgnoreCase(i))
						{
							String ds=map.get(i);
							ds= ds.replaceAll("hrs ",":");
							ds=ds.replaceAll("min ",":");
							ds=ds.replaceAll("sec","");
							String[] t=ds.split(":");
							//System.out.println(Arrays.asList(t));
							
							long h=TimeUnit.HOURS.toMillis(Integer.parseInt(t[0]));
							long m=TimeUnit.MINUTES.toMillis(Integer.parseInt(t[1]));
							long sec=TimeUnit.SECONDS.toMillis(Integer.parseInt(t[2]));
							
							//Date d=new SimpleDateFormat("hh:mm:ss").parse(ds);
							long l=h+m+sec;
							//SimpleDateFormat sf=new SimpleDateFormat("hh:mm:ss a");
							kvp.put(i,l);
							
							
						}
						else if("Total Count".equalsIgnoreCase(i)||"Success Count".equalsIgnoreCase(i)||"Retry Success".equalsIgnoreCase(i)||"Failure Count".equalsIgnoreCase(i))
						{
							String ds=map.get(i);
							//System.out.println("the key is"+i);
							Integer it=Integer.parseInt(ds);
							kvp.put(i,it);
						}
						
						else if("Ingestion Rate".equalsIgnoreCase(i))
						{
							String ds=map.get(i);
							//System.out.println("the key is"+i);
							Double it=Double.parseDouble(ds);
							kvp.put(i,it);
							
						}
						
						else
						{
					kvp.put(i, map.get(i));
						}
						}
						catch(Exception e)
						{
							System.out.println("Exception while Parsing"+e.getMessage());
						}
						//kvp.put(i, map.get(i));
						//System.out.println(i+ ": "+map.get(i));
					}
					jobj.add(kvp);
					
				}
		
						
					
					
				
				
			
			jresp.put("items", jobj);
			jresp.put("downloadlocation", Configuration.getDownloadLocation());
			ip=InetAddress.getByName(Configuration.getRedisHost());
		
			hostname=ip.getHostName();
			String add=ip.getHostAddress();
			//System.out.println("the ip address is:"+add +"the host name is"+hostname);
			jresp.put("ipaddress",add);
			jresp.put("hostname", hostname);
			//System.out.println("the redis columns that needs to hidden are"+Configuration.getHideredisColumns());
			JSONArray columnsTobehidden= new JSONArray();
			
			for(String ss:Configuration.getHideredisColumns())
			{
				//System.out.println("the column name is"+ss);
				columnsTobehidden.add(ss);
				
			}
			jresp.put("hidecolumns",columnsTobehidden);
			
			
			//System.out.println("the Redis JSON Response is"+jresp);
			
			
		}
		catch(Exception e)
		{
			System.out.println("Exception in get Data Method"+e.getMessage());
			jresp.put("ErrorMessage", e.getMessage());
			e.printStackTrace();
			
		}
		return jresp;
	}
	

}
