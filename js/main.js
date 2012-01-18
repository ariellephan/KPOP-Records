// The root URL for the RESTful services
var rootURL = "http://localhost/SlimJ/api/kpops";

var currentArtist;

// Retrieve artist list when application starts 
findAll();

// Nothing to delete in initial application state
$('#btnDelete').hide();

// Register listeners
$('#btnSearch').click(function() {
	search($('#searchKey').val());
	return false;
});

// Trigger search when pressing 'Return' on search key input field
$('#searchKey').keypress(function(e){
	if(e.which == 13) {
		search($('#searchKey').val());
		e.preventDefault();
		return false;
    }
});

$('#btnAdd').click(function() {
	newArtist();
	return false;
});

$('#btnSave').click(function() {
	if ($('#ArtistId').val() == '')
		addArtist();
	else
		updateArtist();
	return false;
});

$('#btnDelete').click(function() {
	deleteArtist();
	return false;
});

$('#ArtistList a').live('click', function() {
	findById($(this).data('identity'));
});

// Replace broken images with generic Artist
$("img").error(function(){
  $(this).attr("src", "pics/generic.jpg");

});

function search(searchKey) {
	if (searchKey == '') 
		findAll();
	else
		findByName(searchKey);
}

function newArtist() {
	$('#btnDelete').hide();
	currentArtist = {};
	renderDetails(currentArtist); // Display empty form
}

function findAll() {
	console.log('findAll');
	$.ajax({
		type: 'GET',
		url: rootURL,
		dataType: "json", // data type of response
		success: renderList
	});
}

function findByName(searchKey) {
	console.log('findByName: ' + searchKey);
	$.ajax({
		type: 'GET',
		url: rootURL + '/search/' + searchKey,
		dataType: "json",
		success: renderList 
	});
}

function findById(id) {
	console.log('findById: ' + id);
	$.ajax({
		type: 'GET',
		url: rootURL + '/' + id,
		dataType: "json",
		success: function(data){
			$('#btnDelete').show();
			console.log('findById success: ' + data.name);
			currentArtist = data;
			renderDetails(currentArtist);
		}
	});
}

function addArtist() {
	console.log('addArtist');
	$.ajax({
		type: 'POST',
		contentType: 'application/json',
		url: rootURL,
		dataType: "json",
		data: formToJSON(),
		success: function(data, textStatus, jqXHR){
			alert('Artist created successfully');
			$('#btnDelete').show();
			$('#ArtistId').val(data.id);
		},
		error: function(jqXHR, textStatus, errorThrown){
			alert('addArtist error: ' + textStatus);
		}
	});
}

function updateArtist() {
	console.log('updateArtist');
	$.ajax({
		type: 'PUT',
		contentType: 'application/json',
		url: rootURL + '/' + $('#ArtistId').val(),
		dataType: "json",
		data: formToJSON(),
		success: function(data, textStatus, jqXHR){
			alert('Artist updated successfully');
		},
		error: function(jqXHR, textStatus, errorThrown){
			alert('updateArtist error: ' + textStatus);
		}
	});
}

function deleteArtist() {
	console.log('deleteArtist');
	$.ajax({
		type: 'DELETE',
		url: rootURL + '/' + $('#ArtistId').val(),
		success: function(data, textStatus, jqXHR){
			alert('Artist deleted successfully');
		},
		error: function(jqXHR, textStatus, errorThrown){
			alert('deleteArtist error');
		}
	});
}

function renderList(data) {
	// JAX-RS serializes an empty list as null, and a 'collection of one' as an object (not an 'array of one')
	var list = data == null ? [] : (data.artist instanceof Array ? data.artist : [data.artist]);

	$('#ArtistList li').remove();
	$.each(list, function(index, artist) {
		$('#ArtistList').append('<li><a href="#" data-identity="' + artist.id + '">'+artist.name+'</a></li>');
	});
}

function renderDetails(artist) {
	$('#ArtistId').val(artist.id);
	$('#name').val(artist.name);
	$('#topalbum').val(artist.topalbum);
	$('#debut').val(artist.debut);
	$('#topsingle').val(artist.topsingle);
	$('#year').val(artist.year);
	$('#pic').attr('src', 'pics/' + artist.picture);
	$('#description').val(artist.description);
}

// Helper function to serialize all the form fields into a JSON string
function formToJSON() {
	return JSON.stringify({
		"id": $('#ArtistId').val(), 
		"name": $('#name').val(), 
		"topalbum": $('#topalbum').val(),
		"debut": $('#debut').val(),
		"hotsingle": $('#hotsingle').val(),
		"year": $('#year').val(),
		"picture": currentArtist.picture,
		"description": $('#description').val()
		});
}
