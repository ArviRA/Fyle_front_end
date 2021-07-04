var availableTutorials = [];
var offset = 0;
var limit = 10;
var pageNo = 1;
var city = "None";
var totalCount = 0;
var query = '';
var orginalData = [];
var displayData = [];

function autocomplete_util()
{
	var x = document.getElementById("automplete-2").value;
	var cache_auto = localStorage.getItem("cache_auto&q=" + x + "&limit=" + limit + "&offset=" + offset)
	console.log("inside cache", cache_auto)
	//localStorage.removeItem("cache_auto&q="+x+"&limit="+limit+"&offset="+offset)
	if (cache_auto == null)

	{
		console.log("enterd iffff")
		fetch("https://fylehqapi.herokuapp.com/api/branches/autocomplete?q=" + x + "&limit=" + 30 + "&offset=" + 0)
			.then(response =>
			{
				return response.json()
			})
			.then(response =>
			{
				var branch_list = []
				data = response.result;
				localStorage.setItem("cache_auto&q=" + x + "&limit=" + limit + "&offset=" + offset, JSON.stringify(data))
				autocomplete_cache(data);

			})
	}
	else
	{
		autocomplete_cache(JSON.parse(cache_auto))
	}
}

function autocomplete_cache(data)
{
	console.log("data", data)
	availableTutorials = []
	if (data.length != 0)
		for (var i = 0; i < 10; i++)
		{
			if (availableTutorials.includes(data[i].branch) == false)
			{
				console.log("here", data[i].branch);
				availableTutorials.push(data[i].branch);
			}
		}
	autocompleteFunc();
}

function getbranch()
{
	var x = document.getElementById("automplete-2").value
	console.log("Branch", x);
	var cache = localStorage.getItem("cache&q=" + x + "&limit=" + limit + "&offset=" + offset)
	if (cache == null)
	{
		fetch("https://fylehqapi.herokuapp.com/api/branches?q=" + x + "&limit=" + limit + "&offset=" + offset)
			.then(response =>
			{
				console.log("def", response);
				return response.json();
			}).then(json =>
			{
				console.log("json", json);
				localStorage.setItem("cache&q=" + x + "&limit=" + limit + "&offset=" + offset, JSON.stringify(json))
				getdata_util(json);

			})
			.catch(error =>
				console.log('Authorization failed : ' + error.message));
	}
	else
	{
		getdata_util(JSON.parse(cache))
	}
}

function autocompleteFunc()
{

	$("#automplete-2").autocomplete(
	{
		source: availableTutorials,
		autoFocus: true
	});
}

function getData(query, limit, offset)
{

	var cache = localStorage.getItem("cache&q=" + query + "&limit=" + limit + "&offset=" + offset)
	if (cache == null)
	{


		fetch("https://fylehqapi.herokuapp.com/api/branches?q=" + query + "&limit=" + limit + "&offset=" + offset)
			.then(response =>
			{
				console.log("def", response);
				return response.json();
			})
			.then(json =>
			{
				console.log("json", json);

				localStorage.setItem("cache&q=" + query + "&limit=" + limit + "&offset=" + offset, JSON.stringify(json))
				getdata_util(json);

			})
			.catch(error =>
				console.log('Authorization failed : ' + error.message));
	}
	else
	{
		console.log("cache", cache)
		getdata_util(JSON.parse(cache));

	}


}

function getdata_util(json)
{
	data = json.result;
	orginalData = data;
	totalCount = Math.ceil(json.totalCount / limit);
	console.log(totalCount, "fe");
	document.getElementById('totalCount').value = totalCount;
	setTable(data)
	filterbycity();
}

function setTable(data)
{
	var tableRow = '<tr><th>IFSC</th><th>BANK ID</th><th>Branch</th><th>Address</th><th>City</th><th>District</th><th>State</th><th>Bank Name</th><th>Favourites</th></tr>';
	var temp_data = localStorage.getItem("Fav")
	temp_data = JSON.parse(temp_data)
	for (i = 0; i < data.length; i++)
	{
		//console.log(data[i])
		tableRow = tableRow + '<tr>';
		var tableData = ''
		var keys = Object.keys(data[i]);
		for (j = 0; j < keys.length; j++)
		{
			if (keys[j] != 'favourites')
			{
				if (keys[j] == "bank_name")
				{
					tableData = tableData + '<td><a href="#"  onclick="popUp(this)" style="color:blue; text-decoration:none" data-label="' + data[i].ifsc + '" value = ' + data[i] + '>' + data[i].bank_name + '</a> </td>'
				}
				else
					tableData = tableData + '<td>' + data[i][keys[j]] + '</td>';
			}
			else

			{
				if (temp_data != null)
				{
					if (temp_data.includes(data[i].ifsc))
					{
						data[i].favourites = 'True'

					}
					else
					{
						data[i].favourites = 'False'
					}
				}
				tableData = tableData + '<td>' + '<input type = "button" style="border-radius: 5px; border:0; background-color:white;" data-label="' + data[i].ifsc + '" onClick = "myfunction(this)" value=' + data[i].favourites + ' name=' + data[i].favourites + '>' + '</td>'

			}
		}

		//Object.keys(data[i]).map(kyeMap(key))
		// Object.keys(data[i]).map((key)=>{
		//     tableData = tableData + '<td>' + data[i][key] + '</td>';
		// })
		tableRow = tableRow + tableData + '</tr>'
	}
	$('table').html(tableRow)
}

function myfunction(bank_ifsc)
{
	var Label_name = bank_ifsc.getAttribute("data-label");
	console.log(Label_name)
	if (bank_ifsc.value != "True")
	{
		bank_ifsc.value = "True"
		var temp_data = localStorage.getItem("Fav")
		temp_data = JSON.parse(temp_data)
		console.log(temp_data)
		if (temp_data != null)
		{
			console.log(temp_data)
			temp_data.push(Label_name)
			localStorage.setItem("Fav", JSON.stringify(temp_data))
		}
		else
		{
			temp_data = []
			temp_data.push(Label_name)
			localStorage.setItem("Fav", JSON.stringify(temp_data))
		}
		//localStorage.setItem("Fav",JSON.(temp_data));

	}
	else
	{
		bank_ifsc.value = "False"
		var temp_data = localStorage.getItem("Fav")
		temp_data = JSON.parse(temp_data)
		var index = temp_data.indexOf(Label_name);
		if (index !== -1)
		{
			temp_data.splice(index, 1);
		}
		localStorage.setItem("Fav", JSON.stringify(temp_data))

	}
	console.log(bank_ifsc.value)
}

function changeLimt()
{

	var x = document.getElementById("limit").value;
	limit = x;
	console.log(x, "changes limt")
	getData(query, limit, offset);

}

function filterbycity()

{
	console.log(orginalData)
	var tempData = [];
	city = document.getElementById("city").value.toUpperCase();
	console.log("kbkbkbk", city);
	if (city != "NONE")
	{
		for (i = 0; i < orginalData.length; i++)
		{
			if (orginalData[i].city == city)
			{
				tempData.push(orginalData[i]);
			}
		}
		setTable(tempData);
	}
	else
	{
		setTable(orginalData);
	}
}

function prevFunc()
{
	var x = document.getElementById("jumpTo").value;
	if (x != 1)
	{
		x = parseInt(x) - 1;
		console.log("after", x)
		var offTemp = x * limit - limit;
		console.log(x, "changes offset", offTemp, "dw");
		pageNo = x;
		offset = offTemp;
		document.getElementById("jumpTo").value = x;
		getData(query, limit, offset);
	}

}

function nextFunc()
{
	var x = document.getElementById("jumpTo").value;
	if (x != totalCount)
	{
		x = parseInt(x) + 1;
		console.log("after", x)
		var offTemp = x * limit - limit;
		console.log(x, "changes offset", offTemp, "dw");
		pageNo = x;
		offset = offTemp;
		document.getElementById("jumpTo").value = x;

		getData(query, limit, offset);
	}

}

function changeOffset()
{
	var x = document.getElementById("jumpTo").value;
	var offTemp = x * limit - limit;
	pageNo = 1;
	offset = offTemp;
	getData(query, limit, offTemp);
}

function getSearchData()
{

	console.log('fe');
	var keyword = document.getElementById("search").value.toUpperCase();
	query = keyword;
	getData(keyword, limit, offset);
}

function filterData()
{
	console.log("fe");
	//var data = [{name:"shaki",data:"31"},{name:"ats",data:"43"}]
	var tempData = []
	console.log("da", orginalData)
	var x = document.getElementById('search').value;
	x = x.toUpperCase()
	for (i = 0; i < orginalData.length; i++)
	{
		keys = Object.keys(orginalData[i]);
		for (j = 0; j < keys.length; j++)
		{
			//console.log(data[i],"de",keys,j,i,x)
			//console.log("as",data[i][keys[j]],x)
			if (keys[j] != "favourites")
			{
				if (orginalData[i][keys[j]].includes(x))
				{
					tempData.push(orginalData[i]);
					break;
				}
			}
		}
	}
	setTable(tempData)
	console.log(tempData)

}

$(document).ready(function ()
{
	getData(query, limit, offset);
});