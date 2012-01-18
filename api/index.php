<?php

require 'Slim/Slim.php';

$app = new Slim();

$app->get('/kpops', 'getArtists');
$app->get('/kpops/:id',	'getArtist');
$app->get('/kpops/search/:query', 'findByName');
$app->post('/kpops', 'addArtist');
$app->put('/kpops/:id', 'updateArtist');
$app->delete('/kpops/:id',	'deleteArtist');

$app->run();

function getArtists() {
	$sql = "select * FROM kpop ORDER BY name";
	try {
		$db = getConnection();
		$stmt = $db->query($sql);  
		$kpops = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		echo '{"artist": ' . json_encode($kpops) . '}';
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function getArtist($id) {
	$sql = "SELECT * FROM kpop WHERE id=:id";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("id", $id);
		$stmt->execute();
		$kpop = $stmt->fetchObject();  
		$db = null;
		echo json_encode($kpop); 
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function addArtist() {
	error_log('addArtist\n', 3, '/var/tmp/php.log');
	$request = Slim::getInstance()->request();
	$kpop = json_decode($request->getBody());
	$sql = "INSERT INTO kpop (name, topalbum, debut, topsingle, year, description) VALUES (:name, :topalbum, :debut, :topsingle, :year, :description)";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("name", $kpop->name);
		$stmt->bindParam("topalbum", $kpop->topalbum);
		$stmt->bindParam("debut", $kpop->debut);
		$stmt->bindParam("topsingle", $kpop->topsingle);
		$stmt->bindParam("year", $kpop->year);
		$stmt->bindParam("description", $kpop->description);
		$stmt->execute();
		$kpop->id = $db->lastInsertId();
		$db = null;
		echo json_encode($kpop); 
	} catch(PDOException $e) {
		error_log($e->getMessage(), 3, '/var/tmp/php.log');
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function updateArtist($id) {
	$request = Slim::getInstance()->request();
	$body = $request->getBody();
	$kpop = json_decode($body);
	$sql = "UPDATE kpop SET name=:name, topalbum=:topalbum, debut=:debut, topsingle=:topsingle, year=:year, description=:description WHERE id=:id";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("name", $kpop->name);
		$stmt->bindParam("topalbum", $kpop->topalbum);
		$stmt->bindParam("debut", $kpop->debut);
		$stmt->bindParam("topsingle", $kpop->topsingle);
		$stmt->bindParam("year", $kpop->year);
		$stmt->bindParam("description", $kpop->description);
		$stmt->bindParam("id", $id);
		$stmt->execute();
		$db = null;
		echo json_encode($kpop); 
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function deleteArtist($id) {
	$sql = "DELETE FROM kpop WHERE id=:id";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("id", $id);
		$stmt->execute();
		$db = null;
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function findByName($query) {
	$sql = "SELECT * FROM kpop WHERE UPPER(name) LIKE :query ORDER BY name";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);
		$query = "%".$query."%";  
		$stmt->bindParam("query", $query);
		$stmt->execute();
		$kpops = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		echo '{"Kpop": ' . json_encode($kpops) . '}';
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function getConnection() {
	$dbhost="localhost";
	$dbuser="root";
	$dbpass="sakura87";
	$dbname="kpop";
	$dbh = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);	
	$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	return $dbh;
}

?>