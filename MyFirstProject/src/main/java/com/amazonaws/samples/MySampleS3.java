package com.amazonaws.samples;

import java.util.Iterator;
import java.util.List;

import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.auth.profile.ProfileCredentialsProvider;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.Bucket;


public class MySampleS3 {
	
	
	public static void main(String[] args) {
		
		/*//AWSCredentials credentials = new ProfileCredentialsProvider().getCredentials();
		//AWSCredentials credentials = new BasicAWSCredentials("YourAccessKeyID", "YourSecretAccessKey");
		System.out.println("Credentials Object : "+credentials);
		AmazonS3 s3client = new AmazonS3Client(credentials);
		String bucketName = "javatutorial-net-example-bucket1234";
		s3client.createBucket(bucketName);
		*/
		AWSCredentials credentials = new BasicAWSCredentials( "AKIAJQ45LXQ3CELYZQ5Q", "irsEX4lAUDMb0evmxB1ON4L18fk+BPGsJTOXVmdN");
		System.out.println("Credentials Object : "+credentials);
		
		AmazonS3 s3Client = new AmazonS3Client(credentials);
		s3Client.createBucket("mybucket2681");
	
		
		List bucketList  = s3Client.listBuckets();
		Iterator bucketIterator = bucketList.iterator();
		Bucket bucket=null;
		while (bucketIterator.hasNext()) {
			bucket = (Bucket) bucketIterator.next();
			System.out.println("Bucket Name : "+bucket.getName());
			//s3Client.deleteBucket(bucket.getName());
		}
		
		//System.out.println("Deleting Objects :");
	}
	
}
