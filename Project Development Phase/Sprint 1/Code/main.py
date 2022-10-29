from twilio.rest import Client
import Keys

client =Client(Keys.account_sid,Keys.auth_token)

message = client.messages.create(
    body=" Mr.Syed Kamal Basha G Take Omez-D before food Medicine",
    from_= Keys.twilio_number,
    to=Keys.target_number

)

print(message.body)


##   In Upcoming Sprint We will complete the code with user Numbers and alert system   ##
