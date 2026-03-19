<?php
/**
 * Learn-Reward Application
 * Main entry point - renders the selected interface
 */

require_once __DIR__ . '/includes/DataManager.php';

// Determine which interface to load
$interface = $_GET['view'] ?? null;

// If not in URL, load from settings in data.json
if (!$interface) {
    $manager = new DataManager();
    $data = $manager->getAllData();
    $interface = $data['settings']['currentInterface'] ?? 'minimalist';
}

// Sanitize and validate
$validInterfaces = ['minimalist', 'pixel', 'retro'];
if (!in_array($interface, $validInterfaces)) {
    $interface = 'minimalist';
}

$interfaceFile = 'views/' . $interface . '.php';
if (!file_exists($interfaceFile)) {
    $interface = 'minimalist';
    $interfaceFile = 'views/minimalist.php';
}

// Include the interface
include $interfaceFile;
