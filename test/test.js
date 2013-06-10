var assert = require('assert'),
    async = require('async');

var ChampCache = require('../champ-cache');

describe('constructor', function(){
    it('takes a local and remote pouch url', function(cb){
        var champ = new ChampCache('local', 'http://localhost:5984/champ');
        champ.get_cached_songs(function(err, songs){
            console.log(err, songs);
            if (songs.rows.length === 0) return cb();
            async.each(songs.rows, function(row, callback){
                champ.remove_cached_song(row.id, callback);
            }, cb);
        })
    });
});


describe('add song', function(){
    it('takes a single id as an arg', function(cb){
        var champ = new ChampCache('local', 'http://localhost:5984/champ-test');
        this.timeout(1200000);

        champ.add_song('1cf6ff42-c6fb-4c08-b60b-8626c6ace17d', function(err, dn){
            cb();
        })
    });
});