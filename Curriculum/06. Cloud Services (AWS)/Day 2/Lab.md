# **Day 2 Lab: S3 Bucket and CloudFront Setup**

## **Objective**:
Set up an S3 bucket to host static assets and use CloudFront as a Content Delivery Network (CDN) for global delivery.

---

## **Step-by-Step Instructions**

### **Step 1: Create an S3 Bucket**  
1. Navigate to the **S3** service in the AWS Management Console.  
2. Click **Create Bucket**.  
3. Provide a unique bucket name (e.g., `my-react-assets`).  
4. Choose a region (e.g., `us-east-1`).  
5. Disable **Block All Public Access**.  
6. Click **Create Bucket**.  

**Explanation**:  
An S3 bucket stores static files such as React build assets. Public access is enabled to allow users to view the content.

---

### **Step 2: Upload Files to S3**  
1. Open the created bucket.  
2. Click **Upload**, then select your React build files (e.g., `index.html`, `bundle.js`).  
3. Click **Upload** to store the files in S3.  

**Explanation**:  
React build files are required to render the frontend. These files are uploaded to S3 for hosting.

---

### **Step 3: Enable Static Website Hosting**  
1. In the bucket settings, go to the **Properties** tab.  
2. Scroll to **Static Website Hosting** and enable it.  
3. Enter `index.html` as the default document.  
4. Copy the **Bucket Endpoint URL**.  

**Explanation**:  
Static website hosting allows S3 to serve the files directly as a website.

---

### **Step 4: Create a CloudFront Distribution**  
1. Navigate to the **CloudFront** service.  
2. Click **Create Distribution** and select **Web**.  
3. Set the **Origin Domain Name** to the S3 bucket.  
4. Enable caching and choose **Use HTTPS**.  
5. Click **Create Distribution** and wait for it to deploy.  

**Explanation**:  
CloudFront improves performance by caching content and delivering it through edge locations globally.

---

### **Step 5: Test the CloudFront URL**  
1. Access the CloudFront domain name provided (e.g., `d123abc.cloudfront.net`).  
2. Verify that the React app loads correctly.  

**Explanation**:  
Testing ensures the CloudFront distribution serves the React app correctly and improves loading times.

---

## **Key Learning Outcomes**:
1. Host static assets using Amazon S3.  
2. Configure a CloudFront distribution for global delivery.  
3. Understand the role of caching and CDNs in performance optimization.

---

