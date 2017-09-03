function validate()
{
	var name = document.getElementById("name").value;
	var voterid = document.getElementById("voterid").value;
	var email = document.getElementById("email").value;
	var age = document.getElementById("age").value;
	var address = document.getElementById("address").value;
	if(name.length==0||voterid.length==0||email.length==0||address.length==0)
	{
		alert("Please fill out all fields");
		return false;
	}
	if((name.match(/([^a-zA-Z. ])+/))!=null)
	{
		alert("No special characters in name ");
		return false;
	}
	if(age.match(/[^0-9]/)!=null||age>150||age<18)
	{
		alert("Enter valid age");
		return false;
	}
	if(address.length>200)
	{
		alert("Address must be less than 200 characters");
		return false;
	}
	var emailTest = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/.test(email);
	if(!emailTest)
	{
		alert("Enter valid email");
		return false;
	}
	return true;
}

function loginvalidate()
{
	var email = document.getElementById("email").value;
	var emailTest = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/.test(email);
	if(!emailTest)
	{
		alert("Enter valid email");
		return false;
	}
	return true;
}

function previewPic()
 {
    var preview = document.getElementById("fingerprint");
    var file = document.querySelector("input[type=file]").files[0];
    var reader = new FileReader();

    reader.addEventListener("load",function(){
        preview.src=reader.result;
    },false);

    if(file)
      reader.readAsDataURL(file);

 }

 function adminvalidate()
 {
 	var name = document.getElementById("name").value;
 	var password = document.getElementById("password").value;
 	if(name.length==0||password.length==0)
	{
		alert("Please fill out all fields");
		return false;
	}
 }