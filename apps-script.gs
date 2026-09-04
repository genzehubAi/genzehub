/* ============================================================================
   GENZEHUB — free backend on Google Apps Script
   ============================================================================

   This gives you a working backend without paying for a server. It stores
   .z name reservations and affiliate applications in a Google
   Sheet, and answers name-availability checks from the site.

   SETUP (about 10 minutes):
   1. Go to sheets.new and create a spreadsheet. Name it "GenzeHub".
   2. Extensions -> Apps Script. Delete whatever is there.
   3. Paste this entire file in. Save.
   4. Deploy -> New deployment -> type: Web app
        Execute as:  Me
        Who has access:  Anyone
      Deploy. Authorise when Google asks.
   5. Copy the /exec URL it gives you and paste it into config.js as
      formEndpoint.

   The sheet creates its own tabs on first use. Do not rename them.
   ============================================================================ */

var SHEETS = {
  names:      ['when', 'name', 'email', 'wallet', 'source'],
  signups:    ['when', 'name', 'email', 'handle', 'wallet', 'ref'],
  affiliates: ['when', 'name', 'email', 'channel', 'size', 'wallet'],
  orders:     ['when', 'plan', 'email', 'method', 'total', 'ref', 'txid']
};

/* Reserved words nobody can claim. Add your own. */
var BLOCKED = ['admin', 'support', 'genze', 'genzehub', 'root', 'help', 'official', 'team'];

function tab_(name) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(name);
  if (!sh) {
    sh = ss.insertSheet(name);
    sh.appendRow(SHEETS[name]);
    sh.setFrozenRows(1);
  }
  return sh;
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/* ---------- GET: is this .z name free? ----------
   /exec?action=check&name=hasnat  ->  {"free":true}                        */
function doGet(e) {
  var p = e.parameter || {};

  if (p.action === 'check') {
    var name = String(p.name || '').toLowerCase().trim();
    if (!/^[a-z0-9_]{2,20}$/.test(name)) {
      return json_({ free: false, reason: 'Letters, numbers and underscore only, 2-20 characters.' });
    }
    if (BLOCKED.indexOf(name) > -1) {
      return json_({ free: false, reason: 'Reserved name.' });
    }
    var rows = tab_('names').getDataRange().getValues();
    for (var i = 1; i < rows.length; i++) {
      if (String(rows[i][1]).toLowerCase() === name) {
        return json_({ free: false, reason: 'Already reserved.' });
      }
    }
    return json_({ free: true });
  }

  if (p.action === 'stats') {
    return json_({
      reserved: Math.max(0, tab_('names').getLastRow() - 1),
      signups:  Math.max(0, tab_('signups').getLastRow() - 1)
    });
  }

  return json_({ ok: true, service: 'genzehub' });
}

/* ---------- POST: save a submission ----------
   Body: {"type":"names"|"signups"|"affiliates"|"orders", ...fields}        */
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var type = data.type;
    if (!SHEETS[type]) return json_({ ok: false, error: 'Unknown type' });

    /* Names are unique — check again on the server. Never trust the browser. */
    if (type === 'names') {
      var name = String(data.name || '').toLowerCase().trim();
      if (!/^[a-z0-9_]{2,20}$/.test(name) || BLOCKED.indexOf(name) > -1) {
        return json_({ ok: false, error: 'That name cannot be reserved.' });
      }
      var rows = tab_('names').getDataRange().getValues();
      for (var i = 1; i < rows.length; i++) {
        if (String(rows[i][1]).toLowerCase() === name) {
          return json_({ ok: false, error: 'Already reserved.' });
        }
      }
      data.name = name;
    }

    var sh = tab_(type);
    var row = SHEETS[type].map(function (col) {
      return col === 'when' ? new Date() : (data[col] || '');
    });
    sh.appendRow(row);

    /* Optional: email yourself on every new row.
       Uncomment and put your address in. */
    // MailApp.sendEmail('you@genzehub.ai', 'New ' + type,
    //   JSON.stringify(data, null, 2));

    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}
