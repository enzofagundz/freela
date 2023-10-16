document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    const db = window.sqlitePlugin.openDatabase({
        name: 'my.db',
        location: 'default',
        androidDatabaseProvider: 'system'
    });
}