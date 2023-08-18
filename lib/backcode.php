<?php
ob_clean();

$url = "https://api.paystack.co/transaction/initialize";
$fields = [
    'email' => $_POST['email'], 
    'amount' => $_POST['amount'] * 100,
    'first_name' => $_POST['firstname'],
    'last_name' => $_POST['lastname'],
    'callback_url' => 'https://paystacknextjs.phamestackrepl.co/verify' // my url will be here
];
$arr = [];

$fields_string = http_build_query($fields);
//open connection
$ch = curl_int();

//set the url, number of POST vars, POST data
curl_setopt($ch,CURLOPT_URL, $url);
curl_setopt($ch,CURLOPT_POST, true);
curl_setopt($ch,CURLOPT_POSTFIELDS, $fields_string);
curl_setopt($ch, CURLOPT_HTTPHEADER, array(
    "Authorization: Bearer sk_live_3967b83de5a18ee58be394ed045d8196a767435f", //my authorization
    "Cache-Control: no-cache",
));

//So that curl_exec returns the contents of the cURL; rather than echoing it
curl_setopt($ch,CURLOPT_RETURNTRANSFER, true); 

//execute post 
$result = curl_exec($ch);
$arr['status'] ='success';
$arr['mess']=$result;
echo json_encode($result);

exit();

?>


