/*
PagePlayer v 0.5.5
 copyright 2010 jezra j lickter
licensed GPL3
http://www.gnu.org/licenses/gpl-3.0.html
*/

//what are the global variables
var audio_duration;
var audio_info = new Array();
var autoplay = false;
var has_audio = false;
var loaded_index;
var audio_volume=0.7;
var project_page='http://localhost/SlimJ';
//what elements will need to be created
var duration_bar;
var duration_background;
var volume_control;
var volume_bar;
var volume_background;
var play;
var pause;
var previous;
var next;
var description_div;
var audio_element=null;
var current_selected_list_item=null;
var page_player_list_item_start = "PagePlayerListItem_";
//make an easy namer function
function $(id) 
{
	return document.getElementById(id);
}

//try create the PagePlayer
function PagePlayer( list )
{
	//can the browser handle audio tags?
	if(typeof Audio=='function' || typeof Audio=='object')
	{
		has_audio=true;
		audio_element = document.createElement('audio');
		audio_element.volume=audio_volume;
		//set the durationchange callback
		audio_element.addEventListener("timeupdate", function(){ updateDurationControl(); },false );
		audio_element.addEventListener("ended",function(){trackEnded();},false);
		;
	}else{
		//bummer, if you are using IE, consider upgrading to chrome or firefox
		return;
	}
	//does this div exist?
	ulist = $(list);
	if(ulist==null)
	{
		PagePlayerError("The ul \""+ulist+"\" does not exist in the web page" );
	}else{
		var ulist_parent = ulist.parentNode;
		//create a wrapper for the player components
		var wrapper = document.createElement("div");
		wrapper.setAttribute("id","PagePlayerWrapper");
		/* build the elements */
		//create the duration div
		d = document.createElement("div");
		d.setAttribute("id","duration");
		//create the duration bar
		duration_bar = document.createElement("div");
		duration_bar.setAttribute('id',"duration_bar");
		//create the duration background
		duration_background = document.createElement("div");
		duration_background.setAttribute('id',"duration_background");
		duration_background.onclick = function(event){ durationClicked(event); }
		//put the duration elements together
		duration_background.appendChild(duration_bar);
		d.appendChild(duration_background);
		//append the duration to the wrapper
		wrapper.appendChild(d);
		//replace the ul with the wrapper
		ulist.parentNode.replaceChild(wrapper,ulist);
		//create a div to hold the "buttons"
		button_bar = document.createElement("div");
		button_bar.setAttribute("id","button_bar");
		//add the button bar
		wrapper.appendChild(button_bar);
		//create the "play" button
		play = document.createElement("div");
		play.setAttribute("id","play");
		play.setAttribute("class","playerbutton");
		
		play.onclick=playClicked;
		//add the button to the buttonbar
		button_bar.appendChild(play);
	
		//create the pause button
		pause = document.createElement("div");
		pause.setAttribute("id","pause");
		pause.setAttribute("class","playerbutton");
		
		pause.onclick=pauseClicked;
		//add the button to the buttonbar
		button_bar.appendChild(pause);


		//create the "previous" button
		previous = document.createElement("div");
		previous.setAttribute("id","previous");
		previous.setAttribute("class","playerbutton");
		
		previous.onclick=previousClicked;
		//add the button to the buttonbar
		button_bar.appendChild(previous);
		//create the "next" button
		next = document.createElement("div");
		next.setAttribute("id","next");
		next.setAttribute("class","playerbutton");
		
		next.onclick=nextClicked;
		//add the button to the buttonbar
		button_bar.appendChild(next);
		//create the volume div
		volume_control = document.createElement("div");
		volume_control.setAttribute("id","volume_control");
		//create the volume bar
		volume_bar = document.createElement("div");
		volume_bar.setAttribute('id',"volume_bar");
		//create the volume background
		volume_background = document.createElement("div");
		volume_background.setAttribute('id',"volume_background");
		volume_background.onclick = function(event){ volumeClicked(event); }
		//put the volume elements together
		volume_background.appendChild(volume_bar);
		volume_control.appendChild(volume_background);
		//append the volume to the wrapper
		wrapper.appendChild(volume_control);
		//create a div to hold the list and info
		listDescWrapper = document.createElement("div");
		listDescWrapper.setAttribute("id","PagePlayerListDescWrapper");
		//append the lIW to the wrapper
		wrapper.appendChild(listDescWrapper);
		//create a div to hold the new list
		listdiv = document.createElement("div");
		listdiv.setAttribute("id","PagePlayerList");
		//make an Desc for the list info
		description_div = document.createElement("div");
		description_div.setAttribute("id","PagePlayerDescription");
		//append the listdiv to the listDescwrapper
		listDescWrapper.appendChild(listdiv);
		//append the desc to the listDescwrapper
		listDescWrapper.appendChild(description_div);
		
		//create one last div that we will clear:both
		breaker = document.createElement("div");
		breaker.setAttribute("id","breaker");
		breaker.style.clear="both";
		wrapper.appendChild(breaker);
		//create the link to the project page
	
		
		track_list = ulist.getElementsByTagName("li");
		tl_len = track_list.length;
		for (var i=0; i< tl_len;i++)
		{
			audio_info[i] = new Array();
			//create a new div to hold this information
			list_item = document.createElement("div");
			list_item.setAttribute("class","PagePlayerListItem");
			list_item.setAttribute("id",page_player_list_item_start+i);
			list_item.onclick=function(){listItemClicked( this.id );}
			var title = "Unknown";
			var desc = "";
			var audio_path = "";
			var nodes = track_list[i].childNodes;
			var nodes_len = nodes.length;
			//loop through the nodes
			for(var j=0 ; j< nodes_len ; j++)
			{
				var node = nodes[j];
				if(node!=null)
				{
					node_name = node.nodeName.toLowerCase();	
					switch(node_name)
					{
						case "h3":
							title = node.innerHTML;
							list_item.appendChild(node);
							break;
						case "p":
							desc = node.innerHTML;
							//list_item.appendChild(node);
							break;
						case "a":
							attrs=node.attributes;
							audio_path=attrs.getNamedItem("href").value;
							break;
						default:
							break;
					}
				}
			}
			audio_info[i]["title"]=title;
			audio_info[i]["desc"]=desc;
			audio_info[i]["audio_path"]=audio_path;
			listdiv.appendChild(list_item);
		}
		//load the initial track
		load_track(0);
		//update the volume bar
		update_volume_bar();
	}
}

function PagePlayerSetDescriptionHeight()
{
	//determine the height of the PagePlayerList
	var list= $("PagePlayerList");
	var height = list.offsetHeight;
	$("PagePlayerDescription").style.height=(height-8)+"px";
	
}


function load_track(id)
{
	if(id!=loaded_index)
	{
		highlightListItem(id);
		loaded_index = id;
		//what is the audio_path?
		audio_path = audio_info[id]["audio_path"];
		//set the audio_elements src
		audio_element.src=audio_path;
		//load the new audio 
		audio_element.load();
		description = audio_info[id]["desc"];
		description_div.innerHTML = description;
	}
}
function highlightListItem(id)
{
	var item = $(page_player_list_item_start+id);
	if(current_selected_list_item!=null)
	{
		current_selected_list_item.setAttribute("class","PagePlayerListItem");
	}
	current_selected_list_item = item;
	item.setAttribute("class","PagePlayerListItemSelected");
}

function playAudio()
{
	audio_element.play();
	//show the pause button
	showPauseButton();
}
function nextClicked()
{
	//increment the index
	var index = loaded_index+1;
	if(index >= audio_info.length)
	{
		index=0;
	}
	//message("playing track: "+index);
	load_track( index );
	playAudio();
}
function previousClicked()
{
	//decrement the index
	index = loaded_index-1;
	if(index < 0 )
	{
		index=audio_info.length-1;
	}
	load_track( index );
	playAudio();
}

function PagePlayerError( errorMessage )
{
	alert ("PagePlayer Error:\n"+errorMessage);
}

function set_volume(new_volume)
{
	audio_element.volume = new_volume;
	update_volume_bar();	
}
function update_volume_bar()
{
	new_width= 100*audio_volume;
	volume_bar.style.width=new_width+"%";
}

function updateDurationControl()
{
	//get the duration of the player
	var dur = audio_element.duration;
	var time = audio_element.currentTime;
	var fraction = time/dur;
	var percent = (fraction*100);
	duration_bar.style.width=percent+"%";

}
function showPauseButton()
{
	play.style.display="none";
	pause.style.display="block";
}

function playClicked()
{
	playAudio();
}

function pauseClicked()
{
	audio_element.pause();
	play.style.display="block";
	pause.style.display="none";
}
function trackEnded()
{
	//play the next track
	nextClicked();
}

function volumeClicked(event)
{
	//get the position of the event
	clientX = event.clientX;
	left = event.currentTarget.offsetLeft;
	clickoffset = clientX - left;
	audio_volume = clickoffset/event.currentTarget.offsetWidth;
	//audio_volume = percent*event.currentTarget.offsetWidth;
	set_volume(audio_volume);
}

function durationClicked(event)
{
	//get the position of the event
	clientX = event.clientX;
	left = event.currentTarget.offsetLeft;
	clickoffset = clientX - left;
	percent = clickoffset/event.currentTarget.offsetWidth;
	audio_duration = audio_element.duration;
	duration_seek = percent*audio_duration;
	audio_element.currentTime=duration_seek; 
}

function listItemClicked(item_id)
{
	//split the item_id
	splits = item_id.split("_");
	//cast the "id" as an int
	id = parseInt( splits[1] );
	//load the new audio
	load_track(id);
	//play the audio
	playAudio();
}

function onPagePlayerLoad()
{
	if(has_audio)
	{
		PagePlayerSetDescriptionHeight();
		if(autoplay) {
			playAudio();
		}
	}
}

function message(str)
{
	$("message").innerHTML=str;
}
