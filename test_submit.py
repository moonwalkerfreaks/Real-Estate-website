import urllib.request
import urllib.parse

url = "https://docs.google.com/forms/d/e/1FAIpQLScCh7s3wwIAzLkXu9pttdnNS-JOL1iiw0G4MQMU-nOGxTbGEA/formResponse"
data = {
    'entry.665789752': 'Test Name',
    'entry.1764999526': '1234567890',
    'entry.722616374': 'Test message from script',
    'emailAddress': 'test@example.com'
}
encoded_data = urllib.parse.urlencode(data).encode('utf-8')

req = urllib.request.Request(url, data=encoded_data)
try:
    response = urllib.request.urlopen(req)
    print("Success! Status:", response.status)
    html = response.read().decode('utf-8')
    if "Your response has been recorded" in html:
        print("Response recorded successfully.")
    else:
        print("Response might not have been recorded. Checking HTML...")
except urllib.error.HTTPError as e:
    print("HTTP Error:", e.code)
    print(e.read().decode('utf-8'))
except Exception as e:
    print("Error:", e)
