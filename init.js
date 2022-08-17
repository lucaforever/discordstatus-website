// values to change for the height of the activities rectangle
var originalh = -0.2;
var addedh = 5;

// different from updatepresence, adds the username, pfp, status, original activities
async function init(data) {
    let json = data;
    document.getElementById("name").innerHTML = json.discord_user['username'] + '#' + json.discord_user['discriminator'];
                                                                                // (change userId to your user ID)
    document.getElementById("avatar").src = "https://cdn.discordapp.com/avatars/549240664773230632/" + json.discord_user['avatar'];
    let activities = json.activities;
    let currentdiv = document.getElementById("activities");
    var h = originalh;
    let curractiv = 1;
    activities.forEach(element => {
        // if not the status activity, continue
        if(element['type'] !== 4) {
            var div = document.createElement("div");
            div.id = element['name'].split(' ').join('').toLowerCase();
            div.className = "activity";
            // if the activity is spotify try to get all of the song info instead of the activity details
            if(element['name'] === "Spotify") {
                var songinfo = [json.spotify['song'], json.spotify['artist'].split('; ').join(', '), json.spotify['album']]
                div.innerHTML = ('<img draggable="false" alt="" width="64" height="64" src="' + json.spotify['album_art_url'] + '"> ' +
                "<strong>" + element['name'] + "</strong>" + "<ul><li>" + songinfo.join("</li><li>") + "</li></ul>");
            } else {
                // time elapsed timer
                const current_time = element.timestamps['start'],
                exp_time = Math.floor(Date.now() / 1000)
                diff = (exp_time * 1000) - current_time,
                formatTime = (ms) => {
                    const seconds = Math.floor((ms / 1000) % 60);
                    const minutes = Math.floor((ms / 1000 / 60) % 60);
                    const hours = Math.floor((ms / 1000 / 3600) % 60);
                    return [hours, minutes, seconds].map(v => String(v).padStart(2,0)).join(':');
                }
                var activityinfo = ["<strong>" + element['name'] + "</strong>", "<p>" + (element['details'] === undefined ? "<br>" : element['details']) + "</p>", "<p>" + (element['state'] === undefined ? formatTime(diff) + " elapsed" : element['state']) + "</p>"]
                if(element.assets !== undefined) {
                    div.innerHTML = ('<img draggable="false" alt="" onerror=this.src="https://cdn.discordapp.com/app-assets/' +
                        element['application_id'] + '/' + element.assets['large_image'] +       // (change userId to your user ID)
                        '.png" width="64" height="64" src="https://cdn.discordapp.com/app-assets/547842383207858178/' +
                        element.assets['large_image'] + '.png"> <div class="other">' +
                        "<ul><li>" + activityinfo.join("</li><li>") + "</li></ul>" + '</div>');
                } else if(element.assets === undefined) {
                    div.innerHTML = ('<img draggable="false" alt="" width="64" height="64" src="unknown.png"> <div class="other">' +
                        "<ul><li>" + activityinfo.join("</li><li>") + "</li></ul>" + '</div>');
                }
            }

            h += addedh;

            currentdiv.appendChild(div);
        } else {
            // if it is the status, set the src of the emoji img and the status text itself
            document.getElementById("statusemoji").src = "https://cdn.discordapp.com/emojis/" + element.emoji['id'] + (element.emoji['animated'] ? ".gif" : ".png");
            document.getElementById("status").innerHTML = element['state'];
        }
    });

    // set height of activities rect
    currentdiv.style.height = h + "rem";
}

async function updatepresence() {
                                    // (change userId to your user ID)
    var json = await lanyard({userId: "549240664773230632"});
    let activities = json.activities;
    let currentdiv = document.getElementById("activities");
    var h = originalh;
    activities.forEach(element => {
        // if not the status activity, continue
        if(element['type'] !== 4) {
            var activityname = element['name'].split(' ').join('').toLowerCase();
            var exists = true;
            if(document.getElementById(activityname) !== null)
                exists = document.getElementById(activityname)['length'] == 0;
            let div = document.getElementById(activityname);

            // check if the activity already exists, if it does just modify the existing one to not create multiple instances
            if(exists) {
                div = document.createElement("div");
                div.id = activityname;
                div.className = "activity";
            }
            
            // if the activity is spotify try to get all of the song info instead of the activity details
            if(element['name'] === "Spotify") {
                var songinfo = [json.spotify['song'], json.spotify['artist'].split('; ').join(', '), json.spotify['album']]
                div.innerHTML = '<img draggable="false" alt="" width="64" height="64" src="' +
                    json.spotify['album_art_url'] + '"> ' +"<strong>" + element['name'] + "</strong>" + "<ul><li>" +
                    songinfo.join("</li><li>") + '</li></ul>';
            } else {
                // time elapsed timer
                const current_time = element.timestamps['start'],
                exp_time = Math.floor(Date.now() / 1000)
                diff = (exp_time * 1000) - current_time,
                formatTime = (ms) => {
                    const seconds = Math.floor((ms / 1000) % 60);
                    const minutes = Math.floor((ms / 1000 / 60) % 60);
                    const hours = Math.floor((ms / 1000 / 3600) % 60);
                    return [hours, minutes, seconds].map(v => String(v).padStart(2,0)).join(':');
                }
                var activityinfo = ["<strong>" + element['name'] + "</strong>", "<p>" + (element['details'] === undefined ? "<br>" : element['details']) + "</p>", "<p>" + (element['state'] === undefined ? formatTime(diff) + " elapsed" : element['state']) + "</p>"]
                if(element.assets !== undefined) {
                    div.innerHTML = ('<img draggable="false" alt="" onerror=this.src="https://cdn.discordapp.com/app-assets/' +
                        element['application_id'] + '/' + element.assets['large_image'] +       // (change userId to your user ID)
                        '.png" width="64" height="64" src="https://cdn.discordapp.com/app-assets/547842383207858178/' +
                        element.assets['large_image'] + '.png"> <div class="other">' +
                        "<ul><li>" + activityinfo.join("</li><li>") + "</li></ul>" + '</div>');
                } else if(element.assets === undefined) {
                    div.innerHTML = ('<img draggable="false" alt="" width="64" height="64" src="unknown.png"> <div class="other">' +
                        "<ul><li>" + activityinfo.join("</li><li>") + "</li></ul>" + '</div>');
                }
            }
            h += addedh;

            if(exists)
                currentdiv.appendChild(div);
        }
    });

    // get the difference of the current activities and the last, mostly just to remove activities that aren't active anymore
    let names = [];
    activities.forEach(e => {if(e['type'] !== 4)names.push(e['name'].split(' ').join('').toLowerCase())})
    var children = [].slice.call(currentdiv.getElementsByClassName('activity'), 0);
    var childnames = new Array(children.length);
    var array1Length = children.length;
    var array2Length = names.length;
    for (var i = 0; i < array1Length; i++) {
        var name = children[i].getAttribute("id");    
        childnames[i] = name;
    }
    var toremove = childnames.filter(x => !names.includes(x));
    children.filter(x => toremove.includes(x.id)).forEach(e => {e.remove()});

    // set height of activities rect
    currentdiv.style.height = h + "rem";
}

const onload = async () => {
    // init all of the original divs and main user details (change userId to your user ID)
    const start = async () => {
        var json = await lanyard({userId: "549240664773230632"});
        init(json);
    }

    start();
    
    // start the websocket to automatically fetch the new details on presence update (change userId to your user ID)
    lanyard({
        userId: "549240664773230632",
        socket: true,
        onPresenceUpdate: updatepresence
    })
}