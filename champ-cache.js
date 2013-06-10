(function (root, factory) {
    if (typeof exports === 'object') {
        module.exports = factory( require('pouchdb'), require('champ-views'));
    } else if (typeof define === 'function' && define.amd) {
        define(['pouchdb', 'champ-views'],factory);
    } else {
        root.champ_cache = factory(root.Pouch, root.champ_views);
    }
}(this, function (Pouch, champ_views) {



    function constructor(local_pouch_url, remote_couch_url, /*optional*/ cache_size) {
        this.local_pouch = Pouch(local_pouch_url);
        this.remote_pouch = Pouch(remote_couch_url);
        this.cache_size = cache_size || 30;
    }


    constructor.prototype.get_cached_songs = function(cb) {
        this.local_pouch.query(champ_views.just_file_docs, cb);
    };

    constructor.prototype.remove_cached_song = function(song_id, cb) {
        var self = this;
        this.local_pouch.get(song_id, function(err, doc){
            if (err) return cb(err);
            self.local_pouch.remove(doc, function(err){
                if (err) return cb(err);

                self.local_pouch.compact(cb);

            });
        });
    };


    constructor.prototype.add_song = function(song_id, cb) {
        if (!song_id) return;
        var options = {
            filter: 'champ/just_file_docs',
            query_params: {
                doc_id: song_id
            }
        };
        Pouch.replicate(this.remote_pouch, this.local_pouch, options, function(err, changes){
            console.log(err, changes);
            cb(null);
        });
    };


    return constructor;

}));