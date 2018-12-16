/**
 * 
 */
package com.ffic.customFeature;

import java.util.ArrayList;

/**
 * @author hchandra
 *
 */
public class RedisColumns {

/*	public static final String UTILITY="Utility Name";
	public static final String BATCHID="Batch id";
	public static final String START_TIME="Start Time";
	public static final String END_TIME="End Time";
	public static final String TOTAL_COUNT="Total Count";
	public static final String SUCCESS_COUNT="Success Count";
	public static final String RETRY_SUCCESS="Retry Success";
	public static final String FAILURE_COUNT="Failure Count";
	public static final String TOTAL_TIME="Total Time";
	public static final String INGESTION_RATE="Ingestion Rate";
	public static final String LIST_ERROR="ListError";
	public static final String MODIFIED_DATE="Modified Date";
	*/
	final String[] columns={"Server Name","Utility Name","Project Name","Batch id","Start Time","End Time","Total Time","Total Count","Success Count","Retry Success","Failure Count" ,"Ingestion Rate","Error Set"};

	public String[] getColumns() {
		return columns;
	}
	
}
