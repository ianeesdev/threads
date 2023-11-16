exports.id = 8204;
exports.ids = [8204];
exports.modules = {

/***/ 76957:
/***/ ((module) => {

// Exports
module.exports = {
	"style": {"fontFamily":"'__Inter_e66fe9', '__Inter_Fallback_e66fe9'","fontStyle":"normal"},
	"className": "__className_e66fe9"
};


/***/ }),

/***/ 8425:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  $: () => (/* reexport */ generateReactHelpers)
});

// EXTERNAL MODULE: external "next/dist/compiled/react-experimental"
var react_experimental_ = __webpack_require__(17640);
;// CONCATENATED MODULE: ./node_modules/@uploadthing/mime-types/dist/chunk-BFQJWQY7.mjs
// src/db.ts
var mimeTypesInternal = {
  "application/andrew-inset": {
    source: "iana",
    extensions: ["ez"],
    compressible: null
  },
  "application/applixware": {
    source: "apache",
    extensions: ["aw"],
    compressible: null
  },
  "application/atom+xml": {
    source: "iana",
    compressible: true,
    extensions: ["atom"]
  },
  "application/atomcat+xml": {
    source: "iana",
    compressible: true,
    extensions: ["atomcat"]
  },
  "application/atomdeleted+xml": {
    source: "iana",
    compressible: true,
    extensions: ["atomdeleted"]
  },
  "application/atomsvc+xml": {
    source: "iana",
    compressible: true,
    extensions: ["atomsvc"]
  },
  "application/atsc-dwd+xml": {
    source: "iana",
    compressible: true,
    extensions: ["dwd"]
  },
  "application/atsc-held+xml": {
    source: "iana",
    compressible: true,
    extensions: ["held"]
  },
  "application/atsc-rsat+xml": {
    source: "iana",
    compressible: true,
    extensions: ["rsat"]
  },
  "application/calendar+xml": {
    source: "iana",
    compressible: true,
    extensions: ["xcs"]
  },
  "application/ccxml+xml": {
    source: "iana",
    compressible: true,
    extensions: ["ccxml"]
  },
  "application/cdfx+xml": {
    source: "iana",
    compressible: true,
    extensions: ["cdfx"]
  },
  "application/cdmi-capability": {
    source: "iana",
    extensions: ["cdmia"],
    compressible: null
  },
  "application/cdmi-container": {
    source: "iana",
    extensions: ["cdmic"],
    compressible: null
  },
  "application/cdmi-domain": {
    source: "iana",
    extensions: ["cdmid"],
    compressible: null
  },
  "application/cdmi-object": {
    source: "iana",
    extensions: ["cdmio"],
    compressible: null
  },
  "application/cdmi-queue": {
    source: "iana",
    extensions: ["cdmiq"],
    compressible: null
  },
  "application/cpl+xml": {
    source: "iana",
    compressible: true,
    extensions: ["cpl"]
  },
  "application/cu-seeme": {
    source: "apache",
    extensions: ["cu"],
    compressible: null
  },
  "application/dash+xml": {
    source: "iana",
    compressible: true,
    extensions: ["mpd"]
  },
  "application/dash-patch+xml": {
    source: "iana",
    compressible: true,
    extensions: ["mpp"]
  },
  "application/davmount+xml": {
    source: "iana",
    compressible: true,
    extensions: ["davmount"]
  },
  "application/docbook+xml": {
    source: "apache",
    compressible: true,
    extensions: ["dbk"]
  },
  "application/dssc+der": {
    source: "iana",
    extensions: ["dssc"],
    compressible: null
  },
  "application/dssc+xml": {
    source: "iana",
    compressible: true,
    extensions: ["xdssc"]
  },
  "application/ecmascript": {
    source: "iana",
    compressible: true,
    extensions: ["es", "ecma"]
  },
  "application/emma+xml": {
    source: "iana",
    compressible: true,
    extensions: ["emma"]
  },
  "application/emotionml+xml": {
    source: "iana",
    compressible: true,
    extensions: ["emotionml"]
  },
  "application/epub+zip": {
    source: "iana",
    compressible: false,
    extensions: ["epub"]
  },
  "application/exi": {
    source: "iana",
    extensions: ["exi"],
    compressible: null
  },
  "application/express": {
    source: "iana",
    extensions: ["exp"],
    compressible: null
  },
  "application/fdt+xml": {
    source: "iana",
    compressible: true,
    extensions: ["fdt"]
  },
  "application/font-tdpfr": {
    source: "iana",
    extensions: ["pfr"],
    compressible: null
  },
  "application/geo+json": {
    source: "iana",
    compressible: true,
    extensions: ["geojson"]
  },
  "application/gml+xml": {
    source: "iana",
    compressible: true,
    extensions: ["gml"]
  },
  "application/gpx+xml": {
    source: "apache",
    compressible: true,
    extensions: ["gpx"]
  },
  "application/gxf": {
    source: "apache",
    extensions: ["gxf"],
    compressible: null
  },
  "application/gzip": {
    source: "iana",
    compressible: false,
    extensions: ["gz"]
  },
  "application/hyperstudio": {
    source: "iana",
    extensions: ["stk"],
    compressible: null
  },
  "application/inkml+xml": {
    source: "iana",
    compressible: true,
    extensions: ["ink", "inkml"]
  },
  "application/ipfix": {
    source: "iana",
    extensions: ["ipfix"],
    compressible: null
  },
  "application/its+xml": {
    source: "iana",
    compressible: true,
    extensions: ["its"]
  },
  "application/java-archive": {
    source: "apache",
    compressible: false,
    extensions: ["jar", "war", "ear"]
  },
  "application/java-serialized-object": {
    source: "apache",
    compressible: false,
    extensions: ["ser"]
  },
  "application/java-vm": {
    source: "apache",
    compressible: false,
    extensions: ["class"]
  },
  "application/javascript": {
    source: "iana",
    charset: "UTF-8",
    compressible: true,
    extensions: ["js", "mjs"]
  },
  "application/json": {
    source: "iana",
    charset: "UTF-8",
    compressible: true,
    extensions: ["json", "map"]
  },
  "application/jsonml+json": {
    source: "apache",
    compressible: true,
    extensions: ["jsonml"]
  },
  "application/ld+json": {
    source: "iana",
    compressible: true,
    extensions: ["jsonld"]
  },
  "application/lgr+xml": {
    source: "iana",
    compressible: true,
    extensions: ["lgr"]
  },
  "application/lost+xml": {
    source: "iana",
    compressible: true,
    extensions: ["lostxml"]
  },
  "application/mac-binhex40": {
    source: "iana",
    extensions: ["hqx"],
    compressible: null
  },
  "application/mac-compactpro": {
    source: "apache",
    extensions: ["cpt"],
    compressible: null
  },
  "application/mads+xml": {
    source: "iana",
    compressible: true,
    extensions: ["mads"]
  },
  "application/manifest+json": {
    source: "iana",
    charset: "UTF-8",
    compressible: true,
    extensions: ["webmanifest"]
  },
  "application/marc": {
    source: "iana",
    extensions: ["mrc"],
    compressible: null
  },
  "application/marcxml+xml": {
    source: "iana",
    compressible: true,
    extensions: ["mrcx"]
  },
  "application/mathematica": {
    source: "iana",
    extensions: ["ma", "nb", "mb"],
    compressible: null
  },
  "application/mathml+xml": {
    source: "iana",
    compressible: true,
    extensions: ["mathml"]
  },
  "application/mbox": {
    source: "iana",
    extensions: ["mbox"],
    compressible: null
  },
  "application/media-policy-dataset+xml": {
    source: "iana",
    compressible: true,
    extensions: ["mpf"]
  },
  "application/mediaservercontrol+xml": {
    source: "iana",
    compressible: true,
    extensions: ["mscml"]
  },
  "application/metalink+xml": {
    source: "apache",
    compressible: true,
    extensions: ["metalink"]
  },
  "application/metalink4+xml": {
    source: "iana",
    compressible: true,
    extensions: ["meta4"]
  },
  "application/mets+xml": {
    source: "iana",
    compressible: true,
    extensions: ["mets"]
  },
  "application/mmt-aei+xml": {
    source: "iana",
    compressible: true,
    extensions: ["maei"]
  },
  "application/mmt-usd+xml": {
    source: "iana",
    compressible: true,
    extensions: ["musd"]
  },
  "application/mods+xml": {
    source: "iana",
    compressible: true,
    extensions: ["mods"]
  },
  "application/mp21": {
    source: "iana",
    extensions: ["m21", "mp21"],
    compressible: null
  },
  "application/mp4": {
    source: "iana",
    extensions: ["mp4s", "m4p"],
    compressible: null
  },
  "application/msword": {
    source: "iana",
    compressible: false,
    extensions: ["doc", "dot"]
  },
  "application/mxf": {
    source: "iana",
    extensions: ["mxf"],
    compressible: null
  },
  "application/n-quads": {
    source: "iana",
    extensions: ["nq"],
    compressible: null
  },
  "application/n-triples": {
    source: "iana",
    extensions: ["nt"],
    compressible: null
  },
  "application/node": {
    source: "iana",
    extensions: ["cjs"],
    compressible: null
  },
  "application/octet-stream": {
    source: "iana",
    compressible: false,
    extensions: [
      "bin",
      "dms",
      "lrf",
      "mar",
      "so",
      "dist",
      "distz",
      "pkg",
      "bpk",
      "dump",
      "elc",
      "deploy",
      "exe",
      "dll",
      "deb",
      "dmg",
      "iso",
      "img",
      "msi",
      "msp",
      "msm",
      "buffer"
    ]
  },
  "application/oda": {
    source: "iana",
    extensions: ["oda"],
    compressible: null
  },
  "application/oebps-package+xml": {
    source: "iana",
    compressible: true,
    extensions: ["opf"]
  },
  "application/ogg": {
    source: "iana",
    compressible: false,
    extensions: ["ogx"]
  },
  "application/omdoc+xml": {
    source: "apache",
    compressible: true,
    extensions: ["omdoc"]
  },
  "application/onenote": {
    source: "apache",
    extensions: ["onetoc", "onetoc2", "onetmp", "onepkg"],
    compressible: null
  },
  "application/oxps": {
    source: "iana",
    extensions: ["oxps"],
    compressible: null
  },
  "application/p2p-overlay+xml": {
    source: "iana",
    compressible: true,
    extensions: ["relo"]
  },
  "application/patch-ops-error+xml": {
    source: "iana",
    compressible: true,
    extensions: ["xer"]
  },
  "application/pdf": {
    source: "iana",
    compressible: false,
    extensions: ["pdf"]
  },
  "application/pgp-encrypted": {
    source: "iana",
    compressible: false,
    extensions: ["pgp"]
  },
  "application/pgp-keys": {
    source: "iana",
    extensions: ["asc"],
    compressible: null
  },
  "application/pgp-signature": {
    source: "iana",
    extensions: ["asc", "sig"],
    compressible: null
  },
  "application/pics-rules": {
    source: "apache",
    extensions: ["prf"],
    compressible: null
  },
  "application/pkcs10": {
    source: "iana",
    extensions: ["p10"],
    compressible: null
  },
  "application/pkcs7-mime": {
    source: "iana",
    extensions: ["p7m", "p7c"],
    compressible: null
  },
  "application/pkcs7-signature": {
    source: "iana",
    extensions: ["p7s"],
    compressible: null
  },
  "application/pkcs8": {
    source: "iana",
    extensions: ["p8"],
    compressible: null
  },
  "application/pkix-attr-cert": {
    source: "iana",
    extensions: ["ac"],
    compressible: null
  },
  "application/pkix-cert": {
    source: "iana",
    extensions: ["cer"],
    compressible: null
  },
  "application/pkix-crl": {
    source: "iana",
    extensions: ["crl"],
    compressible: null
  },
  "application/pkix-pkipath": {
    source: "iana",
    extensions: ["pkipath"],
    compressible: null
  },
  "application/pkixcmp": {
    source: "iana",
    extensions: ["pki"],
    compressible: null
  },
  "application/pls+xml": {
    source: "iana",
    compressible: true,
    extensions: ["pls"]
  },
  "application/postscript": {
    source: "iana",
    compressible: true,
    extensions: ["ai", "eps", "ps"]
  },
  "application/provenance+xml": {
    source: "iana",
    compressible: true,
    extensions: ["provx"]
  },
  "application/prs.cww": {
    source: "iana",
    extensions: ["cww"],
    compressible: null
  },
  "application/pskc+xml": {
    source: "iana",
    compressible: true,
    extensions: ["pskcxml"]
  },
  "application/rdf+xml": {
    source: "iana",
    compressible: true,
    extensions: ["rdf", "owl"]
  },
  "application/reginfo+xml": {
    source: "iana",
    compressible: true,
    extensions: ["rif"]
  },
  "application/relax-ng-compact-syntax": {
    source: "iana",
    extensions: ["rnc"],
    compressible: null
  },
  "application/resource-lists+xml": {
    source: "iana",
    compressible: true,
    extensions: ["rl"]
  },
  "application/resource-lists-diff+xml": {
    source: "iana",
    compressible: true,
    extensions: ["rld"]
  },
  "application/rls-services+xml": {
    source: "iana",
    compressible: true,
    extensions: ["rs"]
  },
  "application/route-apd+xml": {
    source: "iana",
    compressible: true,
    extensions: ["rapd"]
  },
  "application/route-s-tsid+xml": {
    source: "iana",
    compressible: true,
    extensions: ["sls"]
  },
  "application/route-usd+xml": {
    source: "iana",
    compressible: true,
    extensions: ["rusd"]
  },
  "application/rpki-ghostbusters": {
    source: "iana",
    extensions: ["gbr"],
    compressible: null
  },
  "application/rpki-manifest": {
    source: "iana",
    extensions: ["mft"],
    compressible: null
  },
  "application/rpki-roa": {
    source: "iana",
    extensions: ["roa"],
    compressible: null
  },
  "application/rsd+xml": {
    source: "apache",
    compressible: true,
    extensions: ["rsd"]
  },
  "application/rss+xml": {
    source: "apache",
    compressible: true,
    extensions: ["rss"]
  },
  "application/rtf": {
    source: "iana",
    compressible: true,
    extensions: ["rtf"]
  },
  "application/sbml+xml": {
    source: "iana",
    compressible: true,
    extensions: ["sbml"]
  },
  "application/scvp-cv-request": {
    source: "iana",
    extensions: ["scq"],
    compressible: null
  },
  "application/scvp-cv-response": {
    source: "iana",
    extensions: ["scs"],
    compressible: null
  },
  "application/scvp-vp-request": {
    source: "iana",
    extensions: ["spq"],
    compressible: null
  },
  "application/scvp-vp-response": {
    source: "iana",
    extensions: ["spp"],
    compressible: null
  },
  "application/sdp": {
    source: "iana",
    extensions: ["sdp"],
    compressible: null
  },
  "application/senml+xml": {
    source: "iana",
    compressible: true,
    extensions: ["senmlx"]
  },
  "application/sensml+xml": {
    source: "iana",
    compressible: true,
    extensions: ["sensmlx"]
  },
  "application/set-payment-initiation": {
    source: "iana",
    extensions: ["setpay"],
    compressible: null
  },
  "application/set-registration-initiation": {
    source: "iana",
    extensions: ["setreg"],
    compressible: null
  },
  "application/shf+xml": {
    source: "iana",
    compressible: true,
    extensions: ["shf"]
  },
  "application/sieve": {
    source: "iana",
    extensions: ["siv", "sieve"],
    compressible: null
  },
  "application/smil+xml": {
    source: "iana",
    compressible: true,
    extensions: ["smi", "smil"]
  },
  "application/sparql-query": {
    source: "iana",
    extensions: ["rq"],
    compressible: null
  },
  "application/sparql-results+xml": {
    source: "iana",
    compressible: true,
    extensions: ["srx"]
  },
  "application/srgs": {
    source: "iana",
    extensions: ["gram"],
    compressible: null
  },
  "application/srgs+xml": {
    source: "iana",
    compressible: true,
    extensions: ["grxml"]
  },
  "application/sru+xml": {
    source: "iana",
    compressible: true,
    extensions: ["sru"]
  },
  "application/ssdl+xml": {
    source: "apache",
    compressible: true,
    extensions: ["ssdl"]
  },
  "application/ssml+xml": {
    source: "iana",
    compressible: true,
    extensions: ["ssml"]
  },
  "application/swid+xml": {
    source: "iana",
    compressible: true,
    extensions: ["swidtag"]
  },
  "application/tei+xml": {
    source: "iana",
    compressible: true,
    extensions: ["tei", "teicorpus"]
  },
  "application/thraud+xml": {
    source: "iana",
    compressible: true,
    extensions: ["tfi"]
  },
  "application/timestamped-data": {
    source: "iana",
    extensions: ["tsd"],
    compressible: null
  },
  "application/trig": {
    source: "iana",
    extensions: ["trig"],
    compressible: null
  },
  "application/ttml+xml": {
    source: "iana",
    compressible: true,
    extensions: ["ttml"]
  },
  "application/urc-ressheet+xml": {
    source: "iana",
    compressible: true,
    extensions: ["rsheet"]
  },
  "application/urc-targetdesc+xml": {
    source: "iana",
    compressible: true,
    extensions: ["td"]
  },
  "application/vnd.1000minds.decision-model+xml": {
    source: "iana",
    compressible: true,
    extensions: ["1km"]
  },
  "application/vnd.3gpp.pic-bw-large": {
    source: "iana",
    extensions: ["plb"],
    compressible: null
  },
  "application/vnd.3gpp.pic-bw-small": {
    source: "iana",
    extensions: ["psb"],
    compressible: null
  },
  "application/vnd.3gpp.pic-bw-var": {
    source: "iana",
    extensions: ["pvb"],
    compressible: null
  },
  "application/vnd.3gpp2.tcap": {
    source: "iana",
    extensions: ["tcap"],
    compressible: null
  },
  "application/vnd.3m.post-it-notes": {
    source: "iana",
    extensions: ["pwn"],
    compressible: null
  },
  "application/vnd.accpac.simply.aso": {
    source: "iana",
    extensions: ["aso"],
    compressible: null
  },
  "application/vnd.accpac.simply.imp": {
    source: "iana",
    extensions: ["imp"],
    compressible: null
  },
  "application/vnd.acucobol": {
    source: "iana",
    extensions: ["acu"],
    compressible: null
  },
  "application/vnd.acucorp": {
    source: "iana",
    extensions: ["atc", "acutc"],
    compressible: null
  },
  "application/vnd.adobe.air-application-installer-package+zip": {
    source: "apache",
    compressible: false,
    extensions: ["air"]
  },
  "application/vnd.adobe.formscentral.fcdt": {
    source: "iana",
    extensions: ["fcdt"],
    compressible: null
  },
  "application/vnd.adobe.fxp": {
    source: "iana",
    extensions: ["fxp", "fxpl"],
    compressible: null
  },
  "application/vnd.adobe.xdp+xml": {
    source: "iana",
    compressible: true,
    extensions: ["xdp"]
  },
  "application/vnd.adobe.xfdf": {
    source: "iana",
    extensions: ["xfdf"],
    compressible: null
  },
  "application/vnd.age": {
    source: "iana",
    extensions: ["age"],
    compressible: null
  },
  "application/vnd.ahead.space": {
    source: "iana",
    extensions: ["ahead"],
    compressible: null
  },
  "application/vnd.airzip.filesecure.azf": {
    source: "iana",
    extensions: ["azf"],
    compressible: null
  },
  "application/vnd.airzip.filesecure.azs": {
    source: "iana",
    extensions: ["azs"],
    compressible: null
  },
  "application/vnd.amazon.ebook": {
    source: "apache",
    extensions: ["azw"],
    compressible: null
  },
  "application/vnd.americandynamics.acc": {
    source: "iana",
    extensions: ["acc"],
    compressible: null
  },
  "application/vnd.amiga.ami": {
    source: "iana",
    extensions: ["ami"],
    compressible: null
  },
  "application/vnd.android.package-archive": {
    source: "apache",
    compressible: false,
    extensions: ["apk"]
  },
  "application/vnd.anser-web-certificate-issue-initiation": {
    source: "iana",
    extensions: ["cii"],
    compressible: null
  },
  "application/vnd.anser-web-funds-transfer-initiation": {
    source: "apache",
    extensions: ["fti"],
    compressible: null
  },
  "application/vnd.antix.game-component": {
    source: "iana",
    extensions: ["atx"],
    compressible: null
  },
  "application/vnd.apple.installer+xml": {
    source: "iana",
    compressible: true,
    extensions: ["mpkg"]
  },
  "application/vnd.apple.keynote": {
    source: "iana",
    extensions: ["key"],
    compressible: null
  },
  "application/vnd.apple.mpegurl": {
    source: "iana",
    extensions: ["m3u8"],
    compressible: null
  },
  "application/vnd.apple.numbers": {
    source: "iana",
    extensions: ["numbers"],
    compressible: null
  },
  "application/vnd.apple.pages": {
    source: "iana",
    extensions: ["pages"],
    compressible: null
  },
  "application/vnd.aristanetworks.swi": {
    source: "iana",
    extensions: ["swi"],
    compressible: null
  },
  "application/vnd.astraea-software.iota": {
    source: "iana",
    extensions: ["iota"],
    compressible: null
  },
  "application/vnd.audiograph": {
    source: "iana",
    extensions: ["aep"],
    compressible: null
  },
  "application/vnd.balsamiq.bmml+xml": {
    source: "iana",
    compressible: true,
    extensions: ["bmml"]
  },
  "application/vnd.blueice.multipass": {
    source: "iana",
    extensions: ["mpm"],
    compressible: null
  },
  "application/vnd.bmi": {
    source: "iana",
    extensions: ["bmi"],
    compressible: null
  },
  "application/vnd.businessobjects": {
    source: "iana",
    extensions: ["rep"],
    compressible: null
  },
  "application/vnd.chemdraw+xml": {
    source: "iana",
    compressible: true,
    extensions: ["cdxml"]
  },
  "application/vnd.chipnuts.karaoke-mmd": {
    source: "iana",
    extensions: ["mmd"],
    compressible: null
  },
  "application/vnd.cinderella": {
    source: "iana",
    extensions: ["cdy"],
    compressible: null
  },
  "application/vnd.citationstyles.style+xml": {
    source: "iana",
    compressible: true,
    extensions: ["csl"]
  },
  "application/vnd.claymore": {
    source: "iana",
    extensions: ["cla"],
    compressible: null
  },
  "application/vnd.cloanto.rp9": {
    source: "iana",
    extensions: ["rp9"],
    compressible: null
  },
  "application/vnd.clonk.c4group": {
    source: "iana",
    extensions: ["c4g", "c4d", "c4f", "c4p", "c4u"],
    compressible: null
  },
  "application/vnd.cluetrust.cartomobile-config": {
    source: "iana",
    extensions: ["c11amc"],
    compressible: null
  },
  "application/vnd.cluetrust.cartomobile-config-pkg": {
    source: "iana",
    extensions: ["c11amz"],
    compressible: null
  },
  "application/vnd.commonspace": {
    source: "iana",
    extensions: ["csp"],
    compressible: null
  },
  "application/vnd.contact.cmsg": {
    source: "iana",
    extensions: ["cdbcmsg"],
    compressible: null
  },
  "application/vnd.cosmocaller": {
    source: "iana",
    extensions: ["cmc"],
    compressible: null
  },
  "application/vnd.crick.clicker": {
    source: "iana",
    extensions: ["clkx"],
    compressible: null
  },
  "application/vnd.crick.clicker.keyboard": {
    source: "iana",
    extensions: ["clkk"],
    compressible: null
  },
  "application/vnd.crick.clicker.palette": {
    source: "iana",
    extensions: ["clkp"],
    compressible: null
  },
  "application/vnd.crick.clicker.template": {
    source: "iana",
    extensions: ["clkt"],
    compressible: null
  },
  "application/vnd.crick.clicker.wordbank": {
    source: "iana",
    extensions: ["clkw"],
    compressible: null
  },
  "application/vnd.criticaltools.wbs+xml": {
    source: "iana",
    compressible: true,
    extensions: ["wbs"]
  },
  "application/vnd.ctc-posml": {
    source: "iana",
    extensions: ["pml"],
    compressible: null
  },
  "application/vnd.cups-ppd": {
    source: "iana",
    extensions: ["ppd"],
    compressible: null
  },
  "application/vnd.curl.car": {
    source: "apache",
    extensions: ["car"],
    compressible: null
  },
  "application/vnd.curl.pcurl": {
    source: "apache",
    extensions: ["pcurl"],
    compressible: null
  },
  "application/vnd.dart": {
    source: "iana",
    compressible: true,
    extensions: ["dart"]
  },
  "application/vnd.data-vision.rdz": {
    source: "iana",
    extensions: ["rdz"],
    compressible: null
  },
  "application/vnd.dbf": {
    source: "iana",
    extensions: ["dbf"],
    compressible: null
  },
  "application/vnd.dece.data": {
    source: "iana",
    extensions: ["uvf", "uvvf", "uvd", "uvvd"],
    compressible: null
  },
  "application/vnd.dece.ttml+xml": {
    source: "iana",
    compressible: true,
    extensions: ["uvt", "uvvt"]
  },
  "application/vnd.dece.unspecified": {
    source: "iana",
    extensions: ["uvx", "uvvx"],
    compressible: null
  },
  "application/vnd.dece.zip": {
    source: "iana",
    extensions: ["uvz", "uvvz"],
    compressible: null
  },
  "application/vnd.denovo.fcselayout-link": {
    source: "iana",
    extensions: ["fe_launch"],
    compressible: null
  },
  "application/vnd.dna": {
    source: "iana",
    extensions: ["dna"],
    compressible: null
  },
  "application/vnd.dolby.mlp": {
    source: "apache",
    extensions: ["mlp"],
    compressible: null
  },
  "application/vnd.dpgraph": {
    source: "iana",
    extensions: ["dpg"],
    compressible: null
  },
  "application/vnd.dreamfactory": {
    source: "iana",
    extensions: ["dfac"],
    compressible: null
  },
  "application/vnd.ds-keypoint": {
    source: "apache",
    extensions: ["kpxx"],
    compressible: null
  },
  "application/vnd.dvb.ait": {
    source: "iana",
    extensions: ["ait"],
    compressible: null
  },
  "application/vnd.dvb.service": {
    source: "iana",
    extensions: ["svc"],
    compressible: null
  },
  "application/vnd.dynageo": {
    source: "iana",
    extensions: ["geo"],
    compressible: null
  },
  "application/vnd.ecowin.chart": {
    source: "iana",
    extensions: ["mag"],
    compressible: null
  },
  "application/vnd.enliven": {
    source: "iana",
    extensions: ["nml"],
    compressible: null
  },
  "application/vnd.epson.esf": {
    source: "iana",
    extensions: ["esf"],
    compressible: null
  },
  "application/vnd.epson.msf": {
    source: "iana",
    extensions: ["msf"],
    compressible: null
  },
  "application/vnd.epson.quickanime": {
    source: "iana",
    extensions: ["qam"],
    compressible: null
  },
  "application/vnd.epson.salt": {
    source: "iana",
    extensions: ["slt"],
    compressible: null
  },
  "application/vnd.epson.ssf": {
    source: "iana",
    extensions: ["ssf"],
    compressible: null
  },
  "application/vnd.eszigno3+xml": {
    source: "iana",
    compressible: true,
    extensions: ["es3", "et3"]
  },
  "application/vnd.ezpix-album": {
    source: "iana",
    extensions: ["ez2"],
    compressible: null
  },
  "application/vnd.ezpix-package": {
    source: "iana",
    extensions: ["ez3"],
    compressible: null
  },
  "application/vnd.fdf": {
    source: "iana",
    extensions: ["fdf"],
    compressible: null
  },
  "application/vnd.fdsn.mseed": {
    source: "iana",
    extensions: ["mseed"],
    compressible: null
  },
  "application/vnd.fdsn.seed": {
    source: "iana",
    extensions: ["seed", "dataless"],
    compressible: null
  },
  "application/vnd.flographit": {
    source: "iana",
    extensions: ["gph"],
    compressible: null
  },
  "application/vnd.fluxtime.clip": {
    source: "iana",
    extensions: ["ftc"],
    compressible: null
  },
  "application/vnd.framemaker": {
    source: "iana",
    extensions: ["fm", "frame", "maker", "book"],
    compressible: null
  },
  "application/vnd.frogans.fnc": {
    source: "iana",
    extensions: ["fnc"],
    compressible: null
  },
  "application/vnd.frogans.ltf": {
    source: "iana",
    extensions: ["ltf"],
    compressible: null
  },
  "application/vnd.fsc.weblaunch": {
    source: "iana",
    extensions: ["fsc"],
    compressible: null
  },
  "application/vnd.fujitsu.oasys": {
    source: "iana",
    extensions: ["oas"],
    compressible: null
  },
  "application/vnd.fujitsu.oasys2": {
    source: "iana",
    extensions: ["oa2"],
    compressible: null
  },
  "application/vnd.fujitsu.oasys3": {
    source: "iana",
    extensions: ["oa3"],
    compressible: null
  },
  "application/vnd.fujitsu.oasysgp": {
    source: "iana",
    extensions: ["fg5"],
    compressible: null
  },
  "application/vnd.fujitsu.oasysprs": {
    source: "iana",
    extensions: ["bh2"],
    compressible: null
  },
  "application/vnd.fujixerox.ddd": {
    source: "iana",
    extensions: ["ddd"],
    compressible: null
  },
  "application/vnd.fujixerox.docuworks": {
    source: "iana",
    extensions: ["xdw"],
    compressible: null
  },
  "application/vnd.fujixerox.docuworks.binder": {
    source: "iana",
    extensions: ["xbd"],
    compressible: null
  },
  "application/vnd.fuzzysheet": {
    source: "iana",
    extensions: ["fzs"],
    compressible: null
  },
  "application/vnd.genomatix.tuxedo": {
    source: "iana",
    extensions: ["txd"],
    compressible: null
  },
  "application/vnd.geogebra.file": {
    source: "iana",
    extensions: ["ggb"],
    compressible: null
  },
  "application/vnd.geogebra.tool": {
    source: "iana",
    extensions: ["ggt"],
    compressible: null
  },
  "application/vnd.geometry-explorer": {
    source: "iana",
    extensions: ["gex", "gre"],
    compressible: null
  },
  "application/vnd.geonext": {
    source: "iana",
    extensions: ["gxt"],
    compressible: null
  },
  "application/vnd.geoplan": {
    source: "iana",
    extensions: ["g2w"],
    compressible: null
  },
  "application/vnd.geospace": {
    source: "iana",
    extensions: ["g3w"],
    compressible: null
  },
  "application/vnd.gmx": {
    source: "iana",
    extensions: ["gmx"],
    compressible: null
  },
  "application/vnd.google-earth.kml+xml": {
    source: "iana",
    compressible: true,
    extensions: ["kml"]
  },
  "application/vnd.google-earth.kmz": {
    source: "iana",
    compressible: false,
    extensions: ["kmz"]
  },
  "application/vnd.grafeq": {
    source: "iana",
    extensions: ["gqf", "gqs"],
    compressible: null
  },
  "application/vnd.groove-account": {
    source: "iana",
    extensions: ["gac"],
    compressible: null
  },
  "application/vnd.groove-help": {
    source: "iana",
    extensions: ["ghf"],
    compressible: null
  },
  "application/vnd.groove-identity-message": {
    source: "iana",
    extensions: ["gim"],
    compressible: null
  },
  "application/vnd.groove-injector": {
    source: "iana",
    extensions: ["grv"],
    compressible: null
  },
  "application/vnd.groove-tool-message": {
    source: "iana",
    extensions: ["gtm"],
    compressible: null
  },
  "application/vnd.groove-tool-template": {
    source: "iana",
    extensions: ["tpl"],
    compressible: null
  },
  "application/vnd.groove-vcard": {
    source: "iana",
    extensions: ["vcg"],
    compressible: null
  },
  "application/vnd.hal+xml": {
    source: "iana",
    compressible: true,
    extensions: ["hal"]
  },
  "application/vnd.handheld-entertainment+xml": {
    source: "iana",
    compressible: true,
    extensions: ["zmm"]
  },
  "application/vnd.hbci": {
    source: "iana",
    extensions: ["hbci"],
    compressible: null
  },
  "application/vnd.hhe.lesson-player": {
    source: "iana",
    extensions: ["les"],
    compressible: null
  },
  "application/vnd.hp-hpgl": {
    source: "iana",
    extensions: ["hpgl"],
    compressible: null
  },
  "application/vnd.hp-hpid": {
    source: "iana",
    extensions: ["hpid"],
    compressible: null
  },
  "application/vnd.hp-hps": {
    source: "iana",
    extensions: ["hps"],
    compressible: null
  },
  "application/vnd.hp-jlyt": {
    source: "iana",
    extensions: ["jlt"],
    compressible: null
  },
  "application/vnd.hp-pcl": {
    source: "iana",
    extensions: ["pcl"],
    compressible: null
  },
  "application/vnd.hp-pclxl": {
    source: "iana",
    extensions: ["pclxl"],
    compressible: null
  },
  "application/vnd.hydrostatix.sof-data": {
    source: "iana",
    extensions: ["sfd-hdstx"],
    compressible: null
  },
  "application/vnd.ibm.minipay": {
    source: "iana",
    extensions: ["mpy"],
    compressible: null
  },
  "application/vnd.ibm.modcap": {
    source: "iana",
    extensions: ["afp", "listafp", "list3820"],
    compressible: null
  },
  "application/vnd.ibm.rights-management": {
    source: "iana",
    extensions: ["irm"],
    compressible: null
  },
  "application/vnd.ibm.secure-container": {
    source: "iana",
    extensions: ["sc"],
    compressible: null
  },
  "application/vnd.iccprofile": {
    source: "iana",
    extensions: ["icc", "icm"],
    compressible: null
  },
  "application/vnd.igloader": {
    source: "iana",
    extensions: ["igl"],
    compressible: null
  },
  "application/vnd.immervision-ivp": {
    source: "iana",
    extensions: ["ivp"],
    compressible: null
  },
  "application/vnd.immervision-ivu": {
    source: "iana",
    extensions: ["ivu"],
    compressible: null
  },
  "application/vnd.insors.igm": {
    source: "iana",
    extensions: ["igm"],
    compressible: null
  },
  "application/vnd.intercon.formnet": {
    source: "iana",
    extensions: ["xpw", "xpx"],
    compressible: null
  },
  "application/vnd.intergeo": {
    source: "iana",
    extensions: ["i2g"],
    compressible: null
  },
  "application/vnd.intu.qbo": {
    source: "iana",
    extensions: ["qbo"],
    compressible: null
  },
  "application/vnd.intu.qfx": {
    source: "iana",
    extensions: ["qfx"],
    compressible: null
  },
  "application/vnd.ipunplugged.rcprofile": {
    source: "iana",
    extensions: ["rcprofile"],
    compressible: null
  },
  "application/vnd.irepository.package+xml": {
    source: "iana",
    compressible: true,
    extensions: ["irp"]
  },
  "application/vnd.is-xpr": {
    source: "iana",
    extensions: ["xpr"],
    compressible: null
  },
  "application/vnd.isac.fcs": {
    source: "iana",
    extensions: ["fcs"],
    compressible: null
  },
  "application/vnd.jam": {
    source: "iana",
    extensions: ["jam"],
    compressible: null
  },
  "application/vnd.jcp.javame.midlet-rms": {
    source: "iana",
    extensions: ["rms"],
    compressible: null
  },
  "application/vnd.jisp": {
    source: "iana",
    extensions: ["jisp"],
    compressible: null
  },
  "application/vnd.joost.joda-archive": {
    source: "iana",
    extensions: ["joda"],
    compressible: null
  },
  "application/vnd.kahootz": {
    source: "iana",
    extensions: ["ktz", "ktr"],
    compressible: null
  },
  "application/vnd.kde.karbon": {
    source: "iana",
    extensions: ["karbon"],
    compressible: null
  },
  "application/vnd.kde.kchart": {
    source: "iana",
    extensions: ["chrt"],
    compressible: null
  },
  "application/vnd.kde.kformula": {
    source: "iana",
    extensions: ["kfo"],
    compressible: null
  },
  "application/vnd.kde.kivio": {
    source: "iana",
    extensions: ["flw"],
    compressible: null
  },
  "application/vnd.kde.kontour": {
    source: "iana",
    extensions: ["kon"],
    compressible: null
  },
  "application/vnd.kde.kpresenter": {
    source: "iana",
    extensions: ["kpr", "kpt"],
    compressible: null
  },
  "application/vnd.kde.kspread": {
    source: "iana",
    extensions: ["ksp"],
    compressible: null
  },
  "application/vnd.kde.kword": {
    source: "iana",
    extensions: ["kwd", "kwt"],
    compressible: null
  },
  "application/vnd.kenameaapp": {
    source: "iana",
    extensions: ["htke"],
    compressible: null
  },
  "application/vnd.kidspiration": {
    source: "iana",
    extensions: ["kia"],
    compressible: null
  },
  "application/vnd.kinar": {
    source: "iana",
    extensions: ["kne", "knp"],
    compressible: null
  },
  "application/vnd.koan": {
    source: "iana",
    extensions: ["skp", "skd", "skt", "skm"],
    compressible: null
  },
  "application/vnd.kodak-descriptor": {
    source: "iana",
    extensions: ["sse"],
    compressible: null
  },
  "application/vnd.las.las+xml": {
    source: "iana",
    compressible: true,
    extensions: ["lasxml"]
  },
  "application/vnd.llamagraphics.life-balance.desktop": {
    source: "iana",
    extensions: ["lbd"],
    compressible: null
  },
  "application/vnd.llamagraphics.life-balance.exchange+xml": {
    source: "iana",
    compressible: true,
    extensions: ["lbe"]
  },
  "application/vnd.lotus-1-2-3": {
    source: "iana",
    extensions: ["123"],
    compressible: null
  },
  "application/vnd.lotus-approach": {
    source: "iana",
    extensions: ["apr"],
    compressible: null
  },
  "application/vnd.lotus-freelance": {
    source: "iana",
    extensions: ["pre"],
    compressible: null
  },
  "application/vnd.lotus-notes": {
    source: "iana",
    extensions: ["nsf"],
    compressible: null
  },
  "application/vnd.lotus-organizer": {
    source: "iana",
    extensions: ["org"],
    compressible: null
  },
  "application/vnd.lotus-screencam": {
    source: "iana",
    extensions: ["scm"],
    compressible: null
  },
  "application/vnd.lotus-wordpro": {
    source: "iana",
    extensions: ["lwp"],
    compressible: null
  },
  "application/vnd.macports.portpkg": {
    source: "iana",
    extensions: ["portpkg"],
    compressible: null
  },
  "application/vnd.mapbox-vector-tile": {
    source: "iana",
    extensions: ["mvt"],
    compressible: null
  },
  "application/vnd.mcd": {
    source: "iana",
    extensions: ["mcd"],
    compressible: null
  },
  "application/vnd.medcalcdata": {
    source: "iana",
    extensions: ["mc1"],
    compressible: null
  },
  "application/vnd.mediastation.cdkey": {
    source: "iana",
    extensions: ["cdkey"],
    compressible: null
  },
  "application/vnd.mfer": {
    source: "iana",
    extensions: ["mwf"],
    compressible: null
  },
  "application/vnd.mfmp": {
    source: "iana",
    extensions: ["mfm"],
    compressible: null
  },
  "application/vnd.micrografx.flo": {
    source: "iana",
    extensions: ["flo"],
    compressible: null
  },
  "application/vnd.micrografx.igx": {
    source: "iana",
    extensions: ["igx"],
    compressible: null
  },
  "application/vnd.mif": {
    source: "iana",
    extensions: ["mif"],
    compressible: null
  },
  "application/vnd.mobius.daf": {
    source: "iana",
    extensions: ["daf"],
    compressible: null
  },
  "application/vnd.mobius.dis": {
    source: "iana",
    extensions: ["dis"],
    compressible: null
  },
  "application/vnd.mobius.mbk": {
    source: "iana",
    extensions: ["mbk"],
    compressible: null
  },
  "application/vnd.mobius.mqy": {
    source: "iana",
    extensions: ["mqy"],
    compressible: null
  },
  "application/vnd.mobius.msl": {
    source: "iana",
    extensions: ["msl"],
    compressible: null
  },
  "application/vnd.mobius.plc": {
    source: "iana",
    extensions: ["plc"],
    compressible: null
  },
  "application/vnd.mobius.txf": {
    source: "iana",
    extensions: ["txf"],
    compressible: null
  },
  "application/vnd.mophun.application": {
    source: "iana",
    extensions: ["mpn"],
    compressible: null
  },
  "application/vnd.mophun.certificate": {
    source: "iana",
    extensions: ["mpc"],
    compressible: null
  },
  "application/vnd.mozilla.xul+xml": {
    source: "iana",
    compressible: true,
    extensions: ["xul"]
  },
  "application/vnd.ms-artgalry": {
    source: "iana",
    extensions: ["cil"],
    compressible: null
  },
  "application/vnd.ms-cab-compressed": {
    source: "iana",
    extensions: ["cab"],
    compressible: null
  },
  "application/vnd.ms-excel": {
    source: "iana",
    compressible: false,
    extensions: ["xls", "xlm", "xla", "xlc", "xlt", "xlw"]
  },
  "application/vnd.ms-excel.addin.macroenabled.12": {
    source: "iana",
    extensions: ["xlam"],
    compressible: null
  },
  "application/vnd.ms-excel.sheet.binary.macroenabled.12": {
    source: "iana",
    extensions: ["xlsb"],
    compressible: null
  },
  "application/vnd.ms-excel.sheet.macroenabled.12": {
    source: "iana",
    extensions: ["xlsm"],
    compressible: null
  },
  "application/vnd.ms-excel.template.macroenabled.12": {
    source: "iana",
    extensions: ["xltm"],
    compressible: null
  },
  "application/vnd.ms-fontobject": {
    source: "iana",
    compressible: true,
    extensions: ["eot"]
  },
  "application/vnd.ms-htmlhelp": {
    source: "iana",
    extensions: ["chm"],
    compressible: null
  },
  "application/vnd.ms-ims": {
    source: "iana",
    extensions: ["ims"],
    compressible: null
  },
  "application/vnd.ms-lrm": {
    source: "iana",
    extensions: ["lrm"],
    compressible: null
  },
  "application/vnd.ms-officetheme": {
    source: "iana",
    extensions: ["thmx"],
    compressible: null
  },
  "application/vnd.ms-pki.seccat": {
    source: "apache",
    extensions: ["cat"],
    compressible: null
  },
  "application/vnd.ms-pki.stl": {
    source: "apache",
    extensions: ["stl"],
    compressible: null
  },
  "application/vnd.ms-powerpoint": {
    source: "iana",
    compressible: false,
    extensions: ["ppt", "pps", "pot"]
  },
  "application/vnd.ms-powerpoint.addin.macroenabled.12": {
    source: "iana",
    extensions: ["ppam"],
    compressible: null
  },
  "application/vnd.ms-powerpoint.presentation.macroenabled.12": {
    source: "iana",
    extensions: ["pptm"],
    compressible: null
  },
  "application/vnd.ms-powerpoint.slide.macroenabled.12": {
    source: "iana",
    extensions: ["sldm"],
    compressible: null
  },
  "application/vnd.ms-powerpoint.slideshow.macroenabled.12": {
    source: "iana",
    extensions: ["ppsm"],
    compressible: null
  },
  "application/vnd.ms-powerpoint.template.macroenabled.12": {
    source: "iana",
    extensions: ["potm"],
    compressible: null
  },
  "application/vnd.ms-project": {
    source: "iana",
    extensions: ["mpp", "mpt"],
    compressible: null
  },
  "application/vnd.ms-word.document.macroenabled.12": {
    source: "iana",
    extensions: ["docm"],
    compressible: null
  },
  "application/vnd.ms-word.template.macroenabled.12": {
    source: "iana",
    extensions: ["dotm"],
    compressible: null
  },
  "application/vnd.ms-works": {
    source: "iana",
    extensions: ["wps", "wks", "wcm", "wdb"],
    compressible: null
  },
  "application/vnd.ms-wpl": {
    source: "iana",
    extensions: ["wpl"],
    compressible: null
  },
  "application/vnd.ms-xpsdocument": {
    source: "iana",
    compressible: false,
    extensions: ["xps"]
  },
  "application/vnd.mseq": {
    source: "iana",
    extensions: ["mseq"],
    compressible: null
  },
  "application/vnd.musician": {
    source: "iana",
    extensions: ["mus"],
    compressible: null
  },
  "application/vnd.muvee.style": {
    source: "iana",
    extensions: ["msty"],
    compressible: null
  },
  "application/vnd.mynfc": {
    source: "iana",
    extensions: ["taglet"],
    compressible: null
  },
  "application/vnd.neurolanguage.nlu": {
    source: "iana",
    extensions: ["nlu"],
    compressible: null
  },
  "application/vnd.nitf": {
    source: "iana",
    extensions: ["ntf", "nitf"],
    compressible: null
  },
  "application/vnd.noblenet-directory": {
    source: "iana",
    extensions: ["nnd"],
    compressible: null
  },
  "application/vnd.noblenet-sealer": {
    source: "iana",
    extensions: ["nns"],
    compressible: null
  },
  "application/vnd.noblenet-web": {
    source: "iana",
    extensions: ["nnw"],
    compressible: null
  },
  "application/vnd.nokia.n-gage.ac+xml": {
    source: "iana",
    compressible: true,
    extensions: ["ac"]
  },
  "application/vnd.nokia.n-gage.data": {
    source: "iana",
    extensions: ["ngdat"],
    compressible: null
  },
  "application/vnd.nokia.n-gage.symbian.install": {
    source: "iana",
    extensions: ["n-gage"],
    compressible: null
  },
  "application/vnd.nokia.radio-preset": {
    source: "iana",
    extensions: ["rpst"],
    compressible: null
  },
  "application/vnd.nokia.radio-presets": {
    source: "iana",
    extensions: ["rpss"],
    compressible: null
  },
  "application/vnd.novadigm.edm": {
    source: "iana",
    extensions: ["edm"],
    compressible: null
  },
  "application/vnd.novadigm.edx": {
    source: "iana",
    extensions: ["edx"],
    compressible: null
  },
  "application/vnd.novadigm.ext": {
    source: "iana",
    extensions: ["ext"],
    compressible: null
  },
  "application/vnd.oasis.opendocument.chart": {
    source: "iana",
    extensions: ["odc"],
    compressible: null
  },
  "application/vnd.oasis.opendocument.chart-template": {
    source: "iana",
    extensions: ["otc"],
    compressible: null
  },
  "application/vnd.oasis.opendocument.database": {
    source: "iana",
    extensions: ["odb"],
    compressible: null
  },
  "application/vnd.oasis.opendocument.formula": {
    source: "iana",
    extensions: ["odf"],
    compressible: null
  },
  "application/vnd.oasis.opendocument.formula-template": {
    source: "iana",
    extensions: ["odft"],
    compressible: null
  },
  "application/vnd.oasis.opendocument.graphics": {
    source: "iana",
    compressible: false,
    extensions: ["odg"]
  },
  "application/vnd.oasis.opendocument.graphics-template": {
    source: "iana",
    extensions: ["otg"],
    compressible: null
  },
  "application/vnd.oasis.opendocument.image": {
    source: "iana",
    extensions: ["odi"],
    compressible: null
  },
  "application/vnd.oasis.opendocument.image-template": {
    source: "iana",
    extensions: ["oti"],
    compressible: null
  },
  "application/vnd.oasis.opendocument.presentation": {
    source: "iana",
    compressible: false,
    extensions: ["odp"]
  },
  "application/vnd.oasis.opendocument.presentation-template": {
    source: "iana",
    extensions: ["otp"],
    compressible: null
  },
  "application/vnd.oasis.opendocument.spreadsheet": {
    source: "iana",
    compressible: false,
    extensions: ["ods"]
  },
  "application/vnd.oasis.opendocument.spreadsheet-template": {
    source: "iana",
    extensions: ["ots"],
    compressible: null
  },
  "application/vnd.oasis.opendocument.text": {
    source: "iana",
    compressible: false,
    extensions: ["odt"]
  },
  "application/vnd.oasis.opendocument.text-master": {
    source: "iana",
    extensions: ["odm"],
    compressible: null
  },
  "application/vnd.oasis.opendocument.text-template": {
    source: "iana",
    extensions: ["ott"],
    compressible: null
  },
  "application/vnd.oasis.opendocument.text-web": {
    source: "iana",
    extensions: ["oth"],
    compressible: null
  },
  "application/vnd.olpc-sugar": {
    source: "iana",
    extensions: ["xo"],
    compressible: null
  },
  "application/vnd.oma.dd2+xml": {
    source: "iana",
    compressible: true,
    extensions: ["dd2"]
  },
  "application/vnd.openblox.game+xml": {
    source: "iana",
    compressible: true,
    extensions: ["obgx"]
  },
  "application/vnd.openofficeorg.extension": {
    source: "apache",
    extensions: ["oxt"],
    compressible: null
  },
  "application/vnd.openstreetmap.data+xml": {
    source: "iana",
    compressible: true,
    extensions: ["osm"]
  },
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": {
    source: "iana",
    compressible: false,
    extensions: ["pptx"]
  },
  "application/vnd.openxmlformats-officedocument.presentationml.slide": {
    source: "iana",
    extensions: ["sldx"],
    compressible: null
  },
  "application/vnd.openxmlformats-officedocument.presentationml.slideshow": {
    source: "iana",
    extensions: ["ppsx"],
    compressible: null
  },
  "application/vnd.openxmlformats-officedocument.presentationml.template": {
    source: "iana",
    extensions: ["potx"],
    compressible: null
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": {
    source: "iana",
    compressible: false,
    extensions: ["xlsx"]
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.template": {
    source: "iana",
    extensions: ["xltx"],
    compressible: null
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
    source: "iana",
    compressible: false,
    extensions: ["docx"]
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.template": {
    source: "iana",
    extensions: ["dotx"],
    compressible: null
  },
  "application/vnd.osgeo.mapguide.package": {
    source: "iana",
    extensions: ["mgp"],
    compressible: null
  },
  "application/vnd.osgi.dp": {
    source: "iana",
    extensions: ["dp"],
    compressible: null
  },
  "application/vnd.osgi.subsystem": {
    source: "iana",
    extensions: ["esa"],
    compressible: null
  },
  "application/vnd.palm": {
    source: "iana",
    extensions: ["pdb", "pqa", "oprc"],
    compressible: null
  },
  "application/vnd.pawaafile": {
    source: "iana",
    extensions: ["paw"],
    compressible: null
  },
  "application/vnd.pg.format": {
    source: "iana",
    extensions: ["str"],
    compressible: null
  },
  "application/vnd.pg.osasli": {
    source: "iana",
    extensions: ["ei6"],
    compressible: null
  },
  "application/vnd.picsel": {
    source: "iana",
    extensions: ["efif"],
    compressible: null
  },
  "application/vnd.pmi.widget": {
    source: "iana",
    extensions: ["wg"],
    compressible: null
  },
  "application/vnd.pocketlearn": {
    source: "iana",
    extensions: ["plf"],
    compressible: null
  },
  "application/vnd.powerbuilder6": {
    source: "iana",
    extensions: ["pbd"],
    compressible: null
  },
  "application/vnd.previewsystems.box": {
    source: "iana",
    extensions: ["box"],
    compressible: null
  },
  "application/vnd.proteus.magazine": {
    source: "iana",
    extensions: ["mgz"],
    compressible: null
  },
  "application/vnd.publishare-delta-tree": {
    source: "iana",
    extensions: ["qps"],
    compressible: null
  },
  "application/vnd.pvi.ptid1": {
    source: "iana",
    extensions: ["ptid"],
    compressible: null
  },
  "application/vnd.quark.quarkxpress": {
    source: "iana",
    extensions: ["qxd", "qxt", "qwd", "qwt", "qxl", "qxb"],
    compressible: null
  },
  "application/vnd.rar": {
    source: "iana",
    extensions: ["rar"],
    compressible: null
  },
  "application/vnd.realvnc.bed": {
    source: "iana",
    extensions: ["bed"],
    compressible: null
  },
  "application/vnd.recordare.musicxml": {
    source: "iana",
    extensions: ["mxl"],
    compressible: null
  },
  "application/vnd.recordare.musicxml+xml": {
    source: "iana",
    compressible: true,
    extensions: ["musicxml"]
  },
  "application/vnd.rig.cryptonote": {
    source: "iana",
    extensions: ["cryptonote"],
    compressible: null
  },
  "application/vnd.rim.cod": {
    source: "apache",
    extensions: ["cod"],
    compressible: null
  },
  "application/vnd.rn-realmedia": {
    source: "apache",
    extensions: ["rm"],
    compressible: null
  },
  "application/vnd.rn-realmedia-vbr": {
    source: "apache",
    extensions: ["rmvb"],
    compressible: null
  },
  "application/vnd.route66.link66+xml": {
    source: "iana",
    compressible: true,
    extensions: ["link66"]
  },
  "application/vnd.sailingtracker.track": {
    source: "iana",
    extensions: ["st"],
    compressible: null
  },
  "application/vnd.seemail": {
    source: "iana",
    extensions: ["see"],
    compressible: null
  },
  "application/vnd.sema": {
    source: "iana",
    extensions: ["sema"],
    compressible: null
  },
  "application/vnd.semd": {
    source: "iana",
    extensions: ["semd"],
    compressible: null
  },
  "application/vnd.semf": {
    source: "iana",
    extensions: ["semf"],
    compressible: null
  },
  "application/vnd.shana.informed.formdata": {
    source: "iana",
    extensions: ["ifm"],
    compressible: null
  },
  "application/vnd.shana.informed.formtemplate": {
    source: "iana",
    extensions: ["itp"],
    compressible: null
  },
  "application/vnd.shana.informed.interchange": {
    source: "iana",
    extensions: ["iif"],
    compressible: null
  },
  "application/vnd.shana.informed.package": {
    source: "iana",
    extensions: ["ipk"],
    compressible: null
  },
  "application/vnd.simtech-mindmapper": {
    source: "iana",
    extensions: ["twd", "twds"],
    compressible: null
  },
  "application/vnd.smaf": {
    source: "iana",
    extensions: ["mmf"],
    compressible: null
  },
  "application/vnd.smart.teacher": {
    source: "iana",
    extensions: ["teacher"],
    compressible: null
  },
  "application/vnd.software602.filler.form+xml": {
    source: "iana",
    compressible: true,
    extensions: ["fo"]
  },
  "application/vnd.solent.sdkm+xml": {
    source: "iana",
    compressible: true,
    extensions: ["sdkm", "sdkd"]
  },
  "application/vnd.spotfire.dxp": {
    source: "iana",
    extensions: ["dxp"],
    compressible: null
  },
  "application/vnd.spotfire.sfs": {
    source: "iana",
    extensions: ["sfs"],
    compressible: null
  },
  "application/vnd.stardivision.calc": {
    source: "apache",
    extensions: ["sdc"],
    compressible: null
  },
  "application/vnd.stardivision.draw": {
    source: "apache",
    extensions: ["sda"],
    compressible: null
  },
  "application/vnd.stardivision.impress": {
    source: "apache",
    extensions: ["sdd"],
    compressible: null
  },
  "application/vnd.stardivision.math": {
    source: "apache",
    extensions: ["smf"],
    compressible: null
  },
  "application/vnd.stardivision.writer": {
    source: "apache",
    extensions: ["sdw", "vor"],
    compressible: null
  },
  "application/vnd.stardivision.writer-global": {
    source: "apache",
    extensions: ["sgl"],
    compressible: null
  },
  "application/vnd.stepmania.package": {
    source: "iana",
    extensions: ["smzip"],
    compressible: null
  },
  "application/vnd.stepmania.stepchart": {
    source: "iana",
    extensions: ["sm"],
    compressible: null
  },
  "application/vnd.sun.wadl+xml": {
    source: "iana",
    compressible: true,
    extensions: ["wadl"]
  },
  "application/vnd.sun.xml.calc": {
    source: "apache",
    extensions: ["sxc"],
    compressible: null
  },
  "application/vnd.sun.xml.calc.template": {
    source: "apache",
    extensions: ["stc"],
    compressible: null
  },
  "application/vnd.sun.xml.draw": {
    source: "apache",
    extensions: ["sxd"],
    compressible: null
  },
  "application/vnd.sun.xml.draw.template": {
    source: "apache",
    extensions: ["std"],
    compressible: null
  },
  "application/vnd.sun.xml.impress": {
    source: "apache",
    extensions: ["sxi"],
    compressible: null
  },
  "application/vnd.sun.xml.impress.template": {
    source: "apache",
    extensions: ["sti"],
    compressible: null
  },
  "application/vnd.sun.xml.math": {
    source: "apache",
    extensions: ["sxm"],
    compressible: null
  },
  "application/vnd.sun.xml.writer": {
    source: "apache",
    extensions: ["sxw"],
    compressible: null
  },
  "application/vnd.sun.xml.writer.global": {
    source: "apache",
    extensions: ["sxg"],
    compressible: null
  },
  "application/vnd.sun.xml.writer.template": {
    source: "apache",
    extensions: ["stw"],
    compressible: null
  },
  "application/vnd.sus-calendar": {
    source: "iana",
    extensions: ["sus", "susp"],
    compressible: null
  },
  "application/vnd.svd": {
    source: "iana",
    extensions: ["svd"],
    compressible: null
  },
  "application/vnd.symbian.install": {
    source: "apache",
    extensions: ["sis", "sisx"],
    compressible: null
  },
  "application/vnd.syncml+xml": {
    source: "iana",
    charset: "UTF-8",
    compressible: true,
    extensions: ["xsm"]
  },
  "application/vnd.syncml.dm+wbxml": {
    source: "iana",
    charset: "UTF-8",
    extensions: ["bdm"],
    compressible: null
  },
  "application/vnd.syncml.dm+xml": {
    source: "iana",
    charset: "UTF-8",
    compressible: true,
    extensions: ["xdm"]
  },
  "application/vnd.syncml.dmddf+xml": {
    source: "iana",
    charset: "UTF-8",
    compressible: true,
    extensions: ["ddf"]
  },
  "application/vnd.tao.intent-module-archive": {
    source: "iana",
    extensions: ["tao"],
    compressible: null
  },
  "application/vnd.tcpdump.pcap": {
    source: "iana",
    extensions: ["pcap", "cap", "dmp"],
    compressible: null
  },
  "application/vnd.tmobile-livetv": {
    source: "iana",
    extensions: ["tmo"],
    compressible: null
  },
  "application/vnd.trid.tpt": {
    source: "iana",
    extensions: ["tpt"],
    compressible: null
  },
  "application/vnd.triscape.mxs": {
    source: "iana",
    extensions: ["mxs"],
    compressible: null
  },
  "application/vnd.trueapp": {
    source: "iana",
    extensions: ["tra"],
    compressible: null
  },
  "application/vnd.ufdl": {
    source: "iana",
    extensions: ["ufd", "ufdl"],
    compressible: null
  },
  "application/vnd.uiq.theme": {
    source: "iana",
    extensions: ["utz"],
    compressible: null
  },
  "application/vnd.umajin": {
    source: "iana",
    extensions: ["umj"],
    compressible: null
  },
  "application/vnd.unity": {
    source: "iana",
    extensions: ["unityweb"],
    compressible: null
  },
  "application/vnd.uoml+xml": {
    source: "iana",
    compressible: true,
    extensions: ["uoml"]
  },
  "application/vnd.vcx": {
    source: "iana",
    extensions: ["vcx"],
    compressible: null
  },
  "application/vnd.visio": {
    source: "iana",
    extensions: ["vsd", "vst", "vss", "vsw"],
    compressible: null
  },
  "application/vnd.visionary": {
    source: "iana",
    extensions: ["vis"],
    compressible: null
  },
  "application/vnd.vsf": {
    source: "iana",
    extensions: ["vsf"],
    compressible: null
  },
  "application/vnd.wap.wbxml": {
    source: "iana",
    charset: "UTF-8",
    extensions: ["wbxml"],
    compressible: null
  },
  "application/vnd.wap.wmlc": {
    source: "iana",
    extensions: ["wmlc"],
    compressible: null
  },
  "application/vnd.wap.wmlscriptc": {
    source: "iana",
    extensions: ["wmlsc"],
    compressible: null
  },
  "application/vnd.webturbo": {
    source: "iana",
    extensions: ["wtb"],
    compressible: null
  },
  "application/vnd.wolfram.player": {
    source: "iana",
    extensions: ["nbp"],
    compressible: null
  },
  "application/vnd.wordperfect": {
    source: "iana",
    extensions: ["wpd"],
    compressible: null
  },
  "application/vnd.wqd": {
    source: "iana",
    extensions: ["wqd"],
    compressible: null
  },
  "application/vnd.wt.stf": {
    source: "iana",
    extensions: ["stf"],
    compressible: null
  },
  "application/vnd.xara": {
    source: "iana",
    extensions: ["xar"],
    compressible: null
  },
  "application/vnd.xfdl": {
    source: "iana",
    extensions: ["xfdl"],
    compressible: null
  },
  "application/vnd.yamaha.hv-dic": {
    source: "iana",
    extensions: ["hvd"],
    compressible: null
  },
  "application/vnd.yamaha.hv-script": {
    source: "iana",
    extensions: ["hvs"],
    compressible: null
  },
  "application/vnd.yamaha.hv-voice": {
    source: "iana",
    extensions: ["hvp"],
    compressible: null
  },
  "application/vnd.yamaha.openscoreformat": {
    source: "iana",
    extensions: ["osf"],
    compressible: null
  },
  "application/vnd.yamaha.openscoreformat.osfpvg+xml": {
    source: "iana",
    compressible: true,
    extensions: ["osfpvg"]
  },
  "application/vnd.yamaha.smaf-audio": {
    source: "iana",
    extensions: ["saf"],
    compressible: null
  },
  "application/vnd.yamaha.smaf-phrase": {
    source: "iana",
    extensions: ["spf"],
    compressible: null
  },
  "application/vnd.yellowriver-custom-menu": {
    source: "iana",
    extensions: ["cmp"],
    compressible: null
  },
  "application/vnd.zul": {
    source: "iana",
    extensions: ["zir", "zirz"],
    compressible: null
  },
  "application/vnd.zzazz.deck+xml": {
    source: "iana",
    compressible: true,
    extensions: ["zaz"]
  },
  "application/voicexml+xml": {
    source: "iana",
    compressible: true,
    extensions: ["vxml"]
  },
  "application/wasm": {
    source: "iana",
    compressible: true,
    extensions: ["wasm"]
  },
  "application/watcherinfo+xml": {
    source: "iana",
    compressible: true,
    extensions: ["wif"]
  },
  "application/widget": {
    source: "iana",
    extensions: ["wgt"],
    compressible: null
  },
  "application/winhlp": {
    source: "apache",
    extensions: ["hlp"],
    compressible: null
  },
  "application/wsdl+xml": {
    source: "iana",
    compressible: true,
    extensions: ["wsdl"]
  },
  "application/wspolicy+xml": {
    source: "iana",
    compressible: true,
    extensions: ["wspolicy"]
  },
  "application/x-7z-compressed": {
    source: "apache",
    compressible: false,
    extensions: ["7z"]
  },
  "application/x-abiword": {
    source: "apache",
    extensions: ["abw"],
    compressible: null
  },
  "application/x-ace-compressed": {
    source: "apache",
    extensions: ["ace"],
    compressible: null
  },
  "application/x-apple-diskimage": {
    source: "apache",
    extensions: ["dmg"],
    compressible: null
  },
  "application/x-authorware-bin": {
    source: "apache",
    extensions: ["aab", "x32", "u32", "vox"],
    compressible: null
  },
  "application/x-authorware-map": {
    source: "apache",
    extensions: ["aam"],
    compressible: null
  },
  "application/x-authorware-seg": {
    source: "apache",
    extensions: ["aas"],
    compressible: null
  },
  "application/x-bcpio": {
    source: "apache",
    extensions: ["bcpio"],
    compressible: null
  },
  "application/x-bittorrent": {
    source: "apache",
    extensions: ["torrent"],
    compressible: null
  },
  "application/x-blorb": {
    source: "apache",
    extensions: ["blb", "blorb"],
    compressible: null
  },
  "application/x-bzip": {
    source: "apache",
    compressible: false,
    extensions: ["bz"]
  },
  "application/x-bzip2": {
    source: "apache",
    compressible: false,
    extensions: ["bz2", "boz"]
  },
  "application/x-cbr": {
    source: "apache",
    extensions: ["cbr", "cba", "cbt", "cbz", "cb7"],
    compressible: null
  },
  "application/x-cdlink": {
    source: "apache",
    extensions: ["vcd"],
    compressible: null
  },
  "application/x-cfs-compressed": {
    source: "apache",
    extensions: ["cfs"],
    compressible: null
  },
  "application/x-chat": {
    source: "apache",
    extensions: ["chat"],
    compressible: null
  },
  "application/x-chess-pgn": {
    source: "apache",
    extensions: ["pgn"],
    compressible: null
  },
  "application/x-cocoa": {
    source: "nginx",
    extensions: ["cco"],
    compressible: null
  },
  "application/x-conference": {
    source: "apache",
    extensions: ["nsc"],
    compressible: null
  },
  "application/x-cpio": {
    source: "apache",
    extensions: ["cpio"],
    compressible: null
  },
  "application/x-csh": {
    source: "apache",
    extensions: ["csh"],
    compressible: null
  },
  "application/x-debian-package": {
    source: "apache",
    extensions: ["deb", "udeb"],
    compressible: null
  },
  "application/x-dgc-compressed": {
    source: "apache",
    extensions: ["dgc"],
    compressible: null
  },
  "application/x-director": {
    source: "apache",
    extensions: ["dir", "dcr", "dxr", "cst", "cct", "cxt", "w3d", "fgd", "swa"],
    compressible: null
  },
  "application/x-doom": {
    source: "apache",
    extensions: ["wad"],
    compressible: null
  },
  "application/x-dtbncx+xml": {
    source: "apache",
    compressible: true,
    extensions: ["ncx"]
  },
  "application/x-dtbook+xml": {
    source: "apache",
    compressible: true,
    extensions: ["dtb"]
  },
  "application/x-dtbresource+xml": {
    source: "apache",
    compressible: true,
    extensions: ["res"]
  },
  "application/x-dvi": {
    source: "apache",
    compressible: false,
    extensions: ["dvi"]
  },
  "application/x-envoy": {
    source: "apache",
    extensions: ["evy"],
    compressible: null
  },
  "application/x-eva": {
    source: "apache",
    extensions: ["eva"],
    compressible: null
  },
  "application/x-font-bdf": {
    source: "apache",
    extensions: ["bdf"],
    compressible: null
  },
  "application/x-font-ghostscript": {
    source: "apache",
    extensions: ["gsf"],
    compressible: null
  },
  "application/x-font-linux-psf": {
    source: "apache",
    extensions: ["psf"],
    compressible: null
  },
  "application/x-font-pcf": {
    source: "apache",
    extensions: ["pcf"],
    compressible: null
  },
  "application/x-font-snf": {
    source: "apache",
    extensions: ["snf"],
    compressible: null
  },
  "application/x-font-type1": {
    source: "apache",
    extensions: ["pfa", "pfb", "pfm", "afm"],
    compressible: null
  },
  "application/x-freearc": {
    source: "apache",
    extensions: ["arc"],
    compressible: null
  },
  "application/x-futuresplash": {
    source: "apache",
    extensions: ["spl"],
    compressible: null
  },
  "application/x-gca-compressed": {
    source: "apache",
    extensions: ["gca"],
    compressible: null
  },
  "application/x-glulx": {
    source: "apache",
    extensions: ["ulx"],
    compressible: null
  },
  "application/x-gnumeric": {
    source: "apache",
    extensions: ["gnumeric"],
    compressible: null
  },
  "application/x-gramps-xml": {
    source: "apache",
    extensions: ["gramps"],
    compressible: null
  },
  "application/x-gtar": {
    source: "apache",
    extensions: ["gtar"],
    compressible: null
  },
  "application/x-hdf": {
    source: "apache",
    extensions: ["hdf"],
    compressible: null
  },
  "application/x-install-instructions": {
    source: "apache",
    extensions: ["install"],
    compressible: null
  },
  "application/x-iso9660-image": {
    source: "apache",
    extensions: ["iso"],
    compressible: null
  },
  "application/x-java-archive-diff": {
    source: "nginx",
    extensions: ["jardiff"],
    compressible: null
  },
  "application/x-java-jnlp-file": {
    source: "apache",
    compressible: false,
    extensions: ["jnlp"]
  },
  "application/x-latex": {
    source: "apache",
    compressible: false,
    extensions: ["latex"]
  },
  "application/x-lzh-compressed": {
    source: "apache",
    extensions: ["lzh", "lha"],
    compressible: null
  },
  "application/x-makeself": {
    source: "nginx",
    extensions: ["run"],
    compressible: null
  },
  "application/x-mie": {
    source: "apache",
    extensions: ["mie"],
    compressible: null
  },
  "application/x-mobipocket-ebook": {
    source: "apache",
    extensions: ["prc", "mobi"],
    compressible: null
  },
  "application/x-ms-application": {
    source: "apache",
    extensions: ["application"],
    compressible: null
  },
  "application/x-ms-shortcut": {
    source: "apache",
    extensions: ["lnk"],
    compressible: null
  },
  "application/x-ms-wmd": {
    source: "apache",
    extensions: ["wmd"],
    compressible: null
  },
  "application/x-ms-wmz": {
    source: "apache",
    extensions: ["wmz"],
    compressible: null
  },
  "application/x-ms-xbap": {
    source: "apache",
    extensions: ["xbap"],
    compressible: null
  },
  "application/x-msaccess": {
    source: "apache",
    extensions: ["mdb"],
    compressible: null
  },
  "application/x-msbinder": {
    source: "apache",
    extensions: ["obd"],
    compressible: null
  },
  "application/x-mscardfile": {
    source: "apache",
    extensions: ["crd"],
    compressible: null
  },
  "application/x-msclip": {
    source: "apache",
    extensions: ["clp"],
    compressible: null
  },
  "application/x-msdownload": {
    source: "apache",
    extensions: ["exe", "dll", "com", "bat", "msi"],
    compressible: null
  },
  "application/x-msmediaview": {
    source: "apache",
    extensions: ["mvb", "m13", "m14"],
    compressible: null
  },
  "application/x-msmetafile": {
    source: "apache",
    extensions: ["wmf", "wmz", "emf", "emz"],
    compressible: null
  },
  "application/x-msmoney": {
    source: "apache",
    extensions: ["mny"],
    compressible: null
  },
  "application/x-mspublisher": {
    source: "apache",
    extensions: ["pub"],
    compressible: null
  },
  "application/x-msschedule": {
    source: "apache",
    extensions: ["scd"],
    compressible: null
  },
  "application/x-msterminal": {
    source: "apache",
    extensions: ["trm"],
    compressible: null
  },
  "application/x-mswrite": {
    source: "apache",
    extensions: ["wri"],
    compressible: null
  },
  "application/x-netcdf": {
    source: "apache",
    extensions: ["nc", "cdf"],
    compressible: null
  },
  "application/x-nzb": {
    source: "apache",
    extensions: ["nzb"],
    compressible: null
  },
  "application/x-perl": {
    source: "nginx",
    extensions: ["pl", "pm"],
    compressible: null
  },
  "application/x-pilot": {
    source: "nginx",
    extensions: ["prc", "pdb"],
    compressible: null
  },
  "application/x-pkcs12": {
    source: "apache",
    compressible: false,
    extensions: ["p12", "pfx"]
  },
  "application/x-pkcs7-certificates": {
    source: "apache",
    extensions: ["p7b", "spc"],
    compressible: null
  },
  "application/x-pkcs7-certreqresp": {
    source: "apache",
    extensions: ["p7r"],
    compressible: null
  },
  "application/x-rar-compressed": {
    source: "apache",
    compressible: false,
    extensions: ["rar"]
  },
  "application/x-redhat-package-manager": {
    source: "nginx",
    extensions: ["rpm"],
    compressible: null
  },
  "application/x-research-info-systems": {
    source: "apache",
    extensions: ["ris"],
    compressible: null
  },
  "application/x-sea": {
    source: "nginx",
    extensions: ["sea"],
    compressible: null
  },
  "application/x-sh": {
    source: "apache",
    compressible: true,
    extensions: ["sh"]
  },
  "application/x-shar": {
    source: "apache",
    extensions: ["shar"],
    compressible: null
  },
  "application/x-shockwave-flash": {
    source: "apache",
    compressible: false,
    extensions: ["swf"]
  },
  "application/x-silverlight-app": {
    source: "apache",
    extensions: ["xap"],
    compressible: null
  },
  "application/x-sql": {
    source: "apache",
    extensions: ["sql"],
    compressible: null
  },
  "application/x-stuffit": {
    source: "apache",
    compressible: false,
    extensions: ["sit"]
  },
  "application/x-stuffitx": {
    source: "apache",
    extensions: ["sitx"],
    compressible: null
  },
  "application/x-subrip": {
    source: "apache",
    extensions: ["srt"],
    compressible: null
  },
  "application/x-sv4cpio": {
    source: "apache",
    extensions: ["sv4cpio"],
    compressible: null
  },
  "application/x-sv4crc": {
    source: "apache",
    extensions: ["sv4crc"],
    compressible: null
  },
  "application/x-t3vm-image": {
    source: "apache",
    extensions: ["t3"],
    compressible: null
  },
  "application/x-tads": {
    source: "apache",
    extensions: ["gam"],
    compressible: null
  },
  "application/x-tar": {
    source: "apache",
    compressible: true,
    extensions: ["tar"]
  },
  "application/x-tcl": {
    source: "apache",
    extensions: ["tcl", "tk"],
    compressible: null
  },
  "application/x-tex": {
    source: "apache",
    extensions: ["tex"],
    compressible: null
  },
  "application/x-tex-tfm": {
    source: "apache",
    extensions: ["tfm"],
    compressible: null
  },
  "application/x-texinfo": {
    source: "apache",
    extensions: ["texinfo", "texi"],
    compressible: null
  },
  "application/x-tgif": {
    source: "apache",
    extensions: ["obj"],
    compressible: null
  },
  "application/x-ustar": {
    source: "apache",
    extensions: ["ustar"],
    compressible: null
  },
  "application/x-wais-source": {
    source: "apache",
    extensions: ["src"],
    compressible: null
  },
  "application/x-x509-ca-cert": {
    source: "iana",
    extensions: ["der", "crt", "pem"],
    compressible: null
  },
  "application/x-xfig": {
    source: "apache",
    extensions: ["fig"],
    compressible: null
  },
  "application/x-xliff+xml": {
    source: "apache",
    compressible: true,
    extensions: ["xlf"]
  },
  "application/x-xpinstall": {
    source: "apache",
    compressible: false,
    extensions: ["xpi"]
  },
  "application/x-xz": {
    source: "apache",
    extensions: ["xz"],
    compressible: null
  },
  "application/x-zmachine": {
    source: "apache",
    extensions: ["z1", "z2", "z3", "z4", "z5", "z6", "z7", "z8"],
    compressible: null
  },
  "application/xaml+xml": {
    source: "apache",
    compressible: true,
    extensions: ["xaml"]
  },
  "application/xcap-att+xml": {
    source: "iana",
    compressible: true,
    extensions: ["xav"]
  },
  "application/xcap-caps+xml": {
    source: "iana",
    compressible: true,
    extensions: ["xca"]
  },
  "application/xcap-diff+xml": {
    source: "iana",
    compressible: true,
    extensions: ["xdf"]
  },
  "application/xcap-el+xml": {
    source: "iana",
    compressible: true,
    extensions: ["xel"]
  },
  "application/xcap-ns+xml": {
    source: "iana",
    compressible: true,
    extensions: ["xns"]
  },
  "application/xenc+xml": {
    source: "iana",
    compressible: true,
    extensions: ["xenc"]
  },
  "application/xhtml+xml": {
    source: "iana",
    compressible: true,
    extensions: ["xhtml", "xht"]
  },
  "application/xliff+xml": {
    source: "iana",
    compressible: true,
    extensions: ["xlf"]
  },
  "application/xml": {
    source: "iana",
    compressible: true,
    extensions: ["xml", "xsl", "xsd", "rng"]
  },
  "application/xml-dtd": {
    source: "iana",
    compressible: true,
    extensions: ["dtd"]
  },
  "application/xop+xml": {
    source: "iana",
    compressible: true,
    extensions: ["xop"]
  },
  "application/xproc+xml": {
    source: "apache",
    compressible: true,
    extensions: ["xpl"]
  },
  "application/xslt+xml": {
    source: "iana",
    compressible: true,
    extensions: ["xsl", "xslt"]
  },
  "application/xspf+xml": {
    source: "apache",
    compressible: true,
    extensions: ["xspf"]
  },
  "application/xv+xml": {
    source: "iana",
    compressible: true,
    extensions: ["mxml", "xhvml", "xvml", "xvm"]
  },
  "application/yang": {
    source: "iana",
    extensions: ["yang"],
    compressible: null
  },
  "application/yin+xml": {
    source: "iana",
    compressible: true,
    extensions: ["yin"]
  },
  "application/zip": {
    source: "iana",
    compressible: false,
    extensions: ["zip"]
  },
  "audio/3gpp": {
    source: "iana",
    compressible: false,
    extensions: ["3gpp"]
  },
  "audio/adpcm": {
    source: "apache",
    extensions: ["adp"],
    compressible: null
  },
  "audio/amr": {
    source: "iana",
    extensions: ["amr"],
    compressible: null
  },
  "audio/basic": {
    source: "iana",
    compressible: false,
    extensions: ["au", "snd"]
  },
  "audio/midi": {
    source: "apache",
    extensions: ["mid", "midi", "kar", "rmi"],
    compressible: null
  },
  "audio/mobile-xmf": {
    source: "iana",
    extensions: ["mxmf"],
    compressible: null
  },
  "audio/mp4": {
    source: "iana",
    compressible: false,
    extensions: ["m4a", "mp4a"]
  },
  "audio/mpeg": {
    source: "iana",
    compressible: false,
    extensions: ["mpga", "mp2", "mp2a", "mp3", "m2a", "m3a"]
  },
  "audio/ogg": {
    source: "iana",
    compressible: false,
    extensions: ["oga", "ogg", "spx", "opus"]
  },
  "audio/s3m": {
    source: "apache",
    extensions: ["s3m"],
    compressible: null
  },
  "audio/silk": {
    source: "apache",
    extensions: ["sil"],
    compressible: null
  },
  "audio/vnd.dece.audio": {
    source: "iana",
    extensions: ["uva", "uvva"],
    compressible: null
  },
  "audio/vnd.digital-winds": {
    source: "iana",
    extensions: ["eol"],
    compressible: null
  },
  "audio/vnd.dra": {
    source: "iana",
    extensions: ["dra"],
    compressible: null
  },
  "audio/vnd.dts": {
    source: "iana",
    extensions: ["dts"],
    compressible: null
  },
  "audio/vnd.dts.hd": {
    source: "iana",
    extensions: ["dtshd"],
    compressible: null
  },
  "audio/vnd.lucent.voice": {
    source: "iana",
    extensions: ["lvp"],
    compressible: null
  },
  "audio/vnd.ms-playready.media.pya": {
    source: "iana",
    extensions: ["pya"],
    compressible: null
  },
  "audio/vnd.nuera.ecelp4800": {
    source: "iana",
    extensions: ["ecelp4800"],
    compressible: null
  },
  "audio/vnd.nuera.ecelp7470": {
    source: "iana",
    extensions: ["ecelp7470"],
    compressible: null
  },
  "audio/vnd.nuera.ecelp9600": {
    source: "iana",
    extensions: ["ecelp9600"],
    compressible: null
  },
  "audio/vnd.rip": {
    source: "iana",
    extensions: ["rip"],
    compressible: null
  },
  "audio/webm": {
    source: "apache",
    compressible: false,
    extensions: ["weba"]
  },
  "audio/x-aac": {
    source: "apache",
    compressible: false,
    extensions: ["aac"]
  },
  "audio/x-aiff": {
    source: "apache",
    extensions: ["aif", "aiff", "aifc"],
    compressible: null
  },
  "audio/x-caf": {
    source: "apache",
    compressible: false,
    extensions: ["caf"]
  },
  "audio/x-flac": {
    source: "apache",
    extensions: ["flac"],
    compressible: null
  },
  "audio/x-m4a": {
    source: "nginx",
    extensions: ["m4a"],
    compressible: null
  },
  "audio/x-matroska": {
    source: "apache",
    extensions: ["mka"],
    compressible: null
  },
  "audio/x-mpegurl": {
    source: "apache",
    extensions: ["m3u"],
    compressible: null
  },
  "audio/x-ms-wax": {
    source: "apache",
    extensions: ["wax"],
    compressible: null
  },
  "audio/x-ms-wma": {
    source: "apache",
    extensions: ["wma"],
    compressible: null
  },
  "audio/x-pn-realaudio": {
    source: "apache",
    extensions: ["ram", "ra"],
    compressible: null
  },
  "audio/x-pn-realaudio-plugin": {
    source: "apache",
    extensions: ["rmp"],
    compressible: null
  },
  "audio/x-realaudio": {
    source: "nginx",
    extensions: ["ra"],
    compressible: null
  },
  "audio/x-wav": {
    source: "apache",
    extensions: ["wav"],
    compressible: null
  },
  "audio/xm": {
    source: "apache",
    extensions: ["xm"],
    compressible: null
  },
  "chemical/x-cdx": {
    source: "apache",
    extensions: ["cdx"],
    compressible: null
  },
  "chemical/x-cif": {
    source: "apache",
    extensions: ["cif"],
    compressible: null
  },
  "chemical/x-cmdf": {
    source: "apache",
    extensions: ["cmdf"],
    compressible: null
  },
  "chemical/x-cml": {
    source: "apache",
    extensions: ["cml"],
    compressible: null
  },
  "chemical/x-csml": {
    source: "apache",
    extensions: ["csml"],
    compressible: null
  },
  "chemical/x-xyz": {
    source: "apache",
    extensions: ["xyz"],
    compressible: null
  },
  "font/collection": {
    source: "iana",
    extensions: ["ttc"],
    compressible: null
  },
  "font/otf": {
    source: "iana",
    compressible: true,
    extensions: ["otf"]
  },
  "font/ttf": {
    source: "iana",
    compressible: true,
    extensions: ["ttf"]
  },
  "font/woff": {
    source: "iana",
    extensions: ["woff"],
    compressible: null
  },
  "font/woff2": {
    source: "iana",
    extensions: ["woff2"],
    compressible: null
  },
  "image/aces": {
    source: "iana",
    extensions: ["exr"],
    compressible: null
  },
  "image/avci": {
    source: "iana",
    extensions: ["avci"],
    compressible: null
  },
  "image/avcs": {
    source: "iana",
    extensions: ["avcs"],
    compressible: null
  },
  "image/avif": {
    source: "iana",
    compressible: false,
    extensions: ["avif"]
  },
  "image/bmp": {
    source: "iana",
    compressible: true,
    extensions: ["bmp"]
  },
  "image/cgm": {
    source: "iana",
    extensions: ["cgm"],
    compressible: null
  },
  "image/dicom-rle": {
    source: "iana",
    extensions: ["drle"],
    compressible: null
  },
  "image/emf": {
    source: "iana",
    extensions: ["emf"],
    compressible: null
  },
  "image/fits": {
    source: "iana",
    extensions: ["fits"],
    compressible: null
  },
  "image/g3fax": {
    source: "iana",
    extensions: ["g3"],
    compressible: null
  },
  "image/gif": {
    source: "iana",
    compressible: false,
    extensions: ["gif"]
  },
  "image/heic": {
    source: "iana",
    extensions: ["heic"],
    compressible: null
  },
  "image/heic-sequence": {
    source: "iana",
    extensions: ["heics"],
    compressible: null
  },
  "image/heif": {
    source: "iana",
    extensions: ["heif"],
    compressible: null
  },
  "image/heif-sequence": {
    source: "iana",
    extensions: ["heifs"],
    compressible: null
  },
  "image/hej2k": {
    source: "iana",
    extensions: ["hej2"],
    compressible: null
  },
  "image/hsj2": {
    source: "iana",
    extensions: ["hsj2"],
    compressible: null
  },
  "image/ief": {
    source: "iana",
    extensions: ["ief"],
    compressible: null
  },
  "image/jls": {
    source: "iana",
    extensions: ["jls"],
    compressible: null
  },
  "image/jp2": {
    source: "iana",
    compressible: false,
    extensions: ["jp2", "jpg2"]
  },
  "image/jpeg": {
    source: "iana",
    compressible: false,
    extensions: ["jpeg", "jpg", "jpe"]
  },
  "image/jph": {
    source: "iana",
    extensions: ["jph"],
    compressible: null
  },
  "image/jphc": {
    source: "iana",
    extensions: ["jhc"],
    compressible: null
  },
  "image/jpm": {
    source: "iana",
    compressible: false,
    extensions: ["jpm"]
  },
  "image/jpx": {
    source: "iana",
    compressible: false,
    extensions: ["jpx", "jpf"]
  },
  "image/jxr": {
    source: "iana",
    extensions: ["jxr"],
    compressible: null
  },
  "image/jxra": {
    source: "iana",
    extensions: ["jxra"],
    compressible: null
  },
  "image/jxrs": {
    source: "iana",
    extensions: ["jxrs"],
    compressible: null
  },
  "image/jxs": {
    source: "iana",
    extensions: ["jxs"],
    compressible: null
  },
  "image/jxsc": {
    source: "iana",
    extensions: ["jxsc"],
    compressible: null
  },
  "image/jxsi": {
    source: "iana",
    extensions: ["jxsi"],
    compressible: null
  },
  "image/jxss": {
    source: "iana",
    extensions: ["jxss"],
    compressible: null
  },
  "image/ktx": {
    source: "iana",
    extensions: ["ktx"],
    compressible: null
  },
  "image/ktx2": {
    source: "iana",
    extensions: ["ktx2"],
    compressible: null
  },
  "image/png": {
    source: "iana",
    compressible: false,
    extensions: ["png"]
  },
  "image/prs.btif": {
    source: "iana",
    extensions: ["btif"],
    compressible: null
  },
  "image/prs.pti": {
    source: "iana",
    extensions: ["pti"],
    compressible: null
  },
  "image/sgi": {
    source: "apache",
    extensions: ["sgi"],
    compressible: null
  },
  "image/svg+xml": {
    source: "iana",
    compressible: true,
    extensions: ["svg", "svgz"]
  },
  "image/t38": {
    source: "iana",
    extensions: ["t38"],
    compressible: null
  },
  "image/tiff": {
    source: "iana",
    compressible: false,
    extensions: ["tif", "tiff"]
  },
  "image/tiff-fx": {
    source: "iana",
    extensions: ["tfx"],
    compressible: null
  },
  "image/vnd.adobe.photoshop": {
    source: "iana",
    compressible: true,
    extensions: ["psd"]
  },
  "image/vnd.airzip.accelerator.azv": {
    source: "iana",
    extensions: ["azv"],
    compressible: null
  },
  "image/vnd.dece.graphic": {
    source: "iana",
    extensions: ["uvi", "uvvi", "uvg", "uvvg"],
    compressible: null
  },
  "image/vnd.djvu": {
    source: "iana",
    extensions: ["djvu", "djv"],
    compressible: null
  },
  "image/vnd.dvb.subtitle": {
    source: "iana",
    extensions: ["sub"],
    compressible: null
  },
  "image/vnd.dwg": {
    source: "iana",
    extensions: ["dwg"],
    compressible: null
  },
  "image/vnd.dxf": {
    source: "iana",
    extensions: ["dxf"],
    compressible: null
  },
  "image/vnd.fastbidsheet": {
    source: "iana",
    extensions: ["fbs"],
    compressible: null
  },
  "image/vnd.fpx": {
    source: "iana",
    extensions: ["fpx"],
    compressible: null
  },
  "image/vnd.fst": {
    source: "iana",
    extensions: ["fst"],
    compressible: null
  },
  "image/vnd.fujixerox.edmics-mmr": {
    source: "iana",
    extensions: ["mmr"],
    compressible: null
  },
  "image/vnd.fujixerox.edmics-rlc": {
    source: "iana",
    extensions: ["rlc"],
    compressible: null
  },
  "image/vnd.microsoft.icon": {
    source: "iana",
    compressible: true,
    extensions: ["ico"]
  },
  "image/vnd.ms-modi": {
    source: "iana",
    extensions: ["mdi"],
    compressible: null
  },
  "image/vnd.ms-photo": {
    source: "apache",
    extensions: ["wdp"],
    compressible: null
  },
  "image/vnd.net-fpx": {
    source: "iana",
    extensions: ["npx"],
    compressible: null
  },
  "image/vnd.pco.b16": {
    source: "iana",
    extensions: ["b16"],
    compressible: null
  },
  "image/vnd.tencent.tap": {
    source: "iana",
    extensions: ["tap"],
    compressible: null
  },
  "image/vnd.valve.source.texture": {
    source: "iana",
    extensions: ["vtf"],
    compressible: null
  },
  "image/vnd.wap.wbmp": {
    source: "iana",
    extensions: ["wbmp"],
    compressible: null
  },
  "image/vnd.xiff": {
    source: "iana",
    extensions: ["xif"],
    compressible: null
  },
  "image/vnd.zbrush.pcx": {
    source: "iana",
    extensions: ["pcx"],
    compressible: null
  },
  "image/webp": {
    source: "apache",
    extensions: ["webp"],
    compressible: null
  },
  "image/wmf": {
    source: "iana",
    extensions: ["wmf"],
    compressible: null
  },
  "image/x-3ds": {
    source: "apache",
    extensions: ["3ds"],
    compressible: null
  },
  "image/x-cmu-raster": {
    source: "apache",
    extensions: ["ras"],
    compressible: null
  },
  "image/x-cmx": {
    source: "apache",
    extensions: ["cmx"],
    compressible: null
  },
  "image/x-freehand": {
    source: "apache",
    extensions: ["fh", "fhc", "fh4", "fh5", "fh7"],
    compressible: null
  },
  "image/x-icon": {
    source: "apache",
    compressible: true,
    extensions: ["ico"]
  },
  "image/x-jng": {
    source: "nginx",
    extensions: ["jng"],
    compressible: null
  },
  "image/x-mrsid-image": {
    source: "apache",
    extensions: ["sid"],
    compressible: null
  },
  "image/x-ms-bmp": {
    source: "nginx",
    compressible: true,
    extensions: ["bmp"]
  },
  "image/x-pcx": {
    source: "apache",
    extensions: ["pcx"],
    compressible: null
  },
  "image/x-pict": {
    source: "apache",
    extensions: ["pic", "pct"],
    compressible: null
  },
  "image/x-portable-anymap": {
    source: "apache",
    extensions: ["pnm"],
    compressible: null
  },
  "image/x-portable-bitmap": {
    source: "apache",
    extensions: ["pbm"],
    compressible: null
  },
  "image/x-portable-graymap": {
    source: "apache",
    extensions: ["pgm"],
    compressible: null
  },
  "image/x-portable-pixmap": {
    source: "apache",
    extensions: ["ppm"],
    compressible: null
  },
  "image/x-rgb": {
    source: "apache",
    extensions: ["rgb"],
    compressible: null
  },
  "image/x-tga": {
    source: "apache",
    extensions: ["tga"],
    compressible: null
  },
  "image/x-xbitmap": {
    source: "apache",
    extensions: ["xbm"],
    compressible: null
  },
  "image/x-xpixmap": {
    source: "apache",
    extensions: ["xpm"],
    compressible: null
  },
  "image/x-xwindowdump": {
    source: "apache",
    extensions: ["xwd"],
    compressible: null
  },
  "message/disposition-notification": {
    source: "iana",
    extensions: ["disposition-notification"],
    compressible: null
  },
  "message/global": {
    source: "iana",
    extensions: ["u8msg"],
    compressible: null
  },
  "message/global-delivery-status": {
    source: "iana",
    extensions: ["u8dsn"],
    compressible: null
  },
  "message/global-disposition-notification": {
    source: "iana",
    extensions: ["u8mdn"],
    compressible: null
  },
  "message/global-headers": {
    source: "iana",
    extensions: ["u8hdr"],
    compressible: null
  },
  "message/rfc822": {
    source: "iana",
    compressible: true,
    extensions: ["eml", "mime"]
  },
  "message/vnd.wfa.wsc": {
    source: "iana",
    extensions: ["wsc"],
    compressible: null
  },
  "model/3mf": {
    source: "iana",
    extensions: ["3mf"],
    compressible: null
  },
  "model/gltf+json": {
    source: "iana",
    compressible: true,
    extensions: ["gltf"]
  },
  "model/gltf-binary": {
    source: "iana",
    compressible: true,
    extensions: ["glb"]
  },
  "model/iges": {
    source: "iana",
    compressible: false,
    extensions: ["igs", "iges"]
  },
  "model/mesh": {
    source: "iana",
    compressible: false,
    extensions: ["msh", "mesh", "silo"]
  },
  "model/mtl": {
    source: "iana",
    extensions: ["mtl"],
    compressible: null
  },
  "model/obj": {
    source: "iana",
    extensions: ["obj"],
    compressible: null
  },
  "model/step+xml": {
    source: "iana",
    compressible: true,
    extensions: ["stpx"]
  },
  "model/step+zip": {
    source: "iana",
    compressible: false,
    extensions: ["stpz"]
  },
  "model/step-xml+zip": {
    source: "iana",
    compressible: false,
    extensions: ["stpxz"]
  },
  "model/stl": {
    source: "iana",
    extensions: ["stl"],
    compressible: null
  },
  "model/vnd.collada+xml": {
    source: "iana",
    compressible: true,
    extensions: ["dae"]
  },
  "model/vnd.dwf": {
    source: "iana",
    extensions: ["dwf"],
    compressible: null
  },
  "model/vnd.gdl": {
    source: "iana",
    extensions: ["gdl"],
    compressible: null
  },
  "model/vnd.gtw": {
    source: "iana",
    extensions: ["gtw"],
    compressible: null
  },
  "model/vnd.mts": {
    source: "iana",
    extensions: ["mts"],
    compressible: null
  },
  "model/vnd.opengex": {
    source: "iana",
    extensions: ["ogex"],
    compressible: null
  },
  "model/vnd.parasolid.transmit.binary": {
    source: "iana",
    extensions: ["x_b"],
    compressible: null
  },
  "model/vnd.parasolid.transmit.text": {
    source: "iana",
    extensions: ["x_t"],
    compressible: null
  },
  "model/vnd.sap.vds": {
    source: "iana",
    extensions: ["vds"],
    compressible: null
  },
  "model/vnd.usdz+zip": {
    source: "iana",
    compressible: false,
    extensions: ["usdz"]
  },
  "model/vnd.valve.source.compiled-map": {
    source: "iana",
    extensions: ["bsp"],
    compressible: null
  },
  "model/vnd.vtu": {
    source: "iana",
    extensions: ["vtu"],
    compressible: null
  },
  "model/vrml": {
    source: "iana",
    compressible: false,
    extensions: ["wrl", "vrml"]
  },
  "model/x3d+binary": {
    source: "apache",
    compressible: false,
    extensions: ["x3db", "x3dbz"]
  },
  "model/x3d+fastinfoset": {
    source: "iana",
    extensions: ["x3db"],
    compressible: null
  },
  "model/x3d+vrml": {
    source: "apache",
    compressible: false,
    extensions: ["x3dv", "x3dvz"]
  },
  "model/x3d+xml": {
    source: "iana",
    compressible: true,
    extensions: ["x3d", "x3dz"]
  },
  "model/x3d-vrml": {
    source: "iana",
    extensions: ["x3dv"],
    compressible: null
  },
  "text/cache-manifest": {
    source: "iana",
    compressible: true,
    extensions: ["appcache", "manifest"]
  },
  "text/calendar": {
    source: "iana",
    extensions: ["ics", "ifb"],
    compressible: null
  },
  "text/css": {
    source: "iana",
    charset: "UTF-8",
    compressible: true,
    extensions: ["css"]
  },
  "text/csv": {
    source: "iana",
    compressible: true,
    extensions: ["csv"]
  },
  "text/html": {
    source: "iana",
    compressible: true,
    extensions: ["html", "htm", "shtml"]
  },
  "text/markdown": {
    source: "iana",
    compressible: true,
    extensions: ["markdown", "md"]
  },
  "text/mathml": {
    source: "nginx",
    extensions: ["mml"],
    compressible: null
  },
  "text/n3": {
    source: "iana",
    charset: "UTF-8",
    compressible: true,
    extensions: ["n3"]
  },
  "text/plain": {
    source: "iana",
    compressible: true,
    extensions: ["txt", "text", "conf", "def", "list", "log", "in", "ini"]
  },
  "text/prs.lines.tag": {
    source: "iana",
    extensions: ["dsc"],
    compressible: null
  },
  "text/richtext": {
    source: "iana",
    compressible: true,
    extensions: ["rtx"]
  },
  "text/rtf": {
    source: "iana",
    compressible: true,
    extensions: ["rtf"]
  },
  "text/sgml": {
    source: "iana",
    extensions: ["sgml", "sgm"],
    compressible: null
  },
  "text/shex": {
    source: "iana",
    extensions: ["shex"],
    compressible: null
  },
  "text/spdx": {
    source: "iana",
    extensions: ["spdx"],
    compressible: null
  },
  "text/tab-separated-values": {
    source: "iana",
    compressible: true,
    extensions: ["tsv"]
  },
  "text/troff": {
    source: "iana",
    extensions: ["t", "tr", "roff", "man", "me", "ms"],
    compressible: null
  },
  "text/turtle": {
    source: "iana",
    charset: "UTF-8",
    extensions: ["ttl"],
    compressible: null
  },
  "text/uri-list": {
    source: "iana",
    compressible: true,
    extensions: ["uri", "uris", "urls"]
  },
  "text/vcard": {
    source: "iana",
    compressible: true,
    extensions: ["vcard"]
  },
  "text/vnd.curl": {
    source: "iana",
    extensions: ["curl"],
    compressible: null
  },
  "text/vnd.curl.dcurl": {
    source: "apache",
    extensions: ["dcurl"],
    compressible: null
  },
  "text/vnd.curl.mcurl": {
    source: "apache",
    extensions: ["mcurl"],
    compressible: null
  },
  "text/vnd.curl.scurl": {
    source: "apache",
    extensions: ["scurl"],
    compressible: null
  },
  "text/vnd.dvb.subtitle": {
    source: "iana",
    extensions: ["sub"],
    compressible: null
  },
  "text/vnd.familysearch.gedcom": {
    source: "iana",
    extensions: ["ged"],
    compressible: null
  },
  "text/vnd.fly": {
    source: "iana",
    extensions: ["fly"],
    compressible: null
  },
  "text/vnd.fmi.flexstor": {
    source: "iana",
    extensions: ["flx"],
    compressible: null
  },
  "text/vnd.graphviz": {
    source: "iana",
    extensions: ["gv"],
    compressible: null
  },
  "text/vnd.in3d.3dml": {
    source: "iana",
    extensions: ["3dml"],
    compressible: null
  },
  "text/vnd.in3d.spot": {
    source: "iana",
    extensions: ["spot"],
    compressible: null
  },
  "text/vnd.sun.j2me.app-descriptor": {
    source: "iana",
    charset: "UTF-8",
    extensions: ["jad"],
    compressible: null
  },
  "text/vnd.wap.wml": {
    source: "iana",
    extensions: ["wml"],
    compressible: null
  },
  "text/vnd.wap.wmlscript": {
    source: "iana",
    extensions: ["wmls"],
    compressible: null
  },
  "text/vtt": {
    source: "iana",
    charset: "UTF-8",
    compressible: true,
    extensions: ["vtt"]
  },
  "text/x-asm": {
    source: "apache",
    extensions: ["s", "asm"],
    compressible: null
  },
  "text/x-c": {
    source: "apache",
    extensions: ["c", "cc", "cxx", "cpp", "h", "hh", "dic"],
    compressible: null
  },
  "text/x-component": {
    source: "nginx",
    extensions: ["htc"],
    compressible: null
  },
  "text/x-fortran": {
    source: "apache",
    extensions: ["f", "for", "f77", "f90"],
    compressible: null
  },
  "text/x-java-source": {
    source: "apache",
    extensions: ["java"],
    compressible: null
  },
  "text/x-nfo": {
    source: "apache",
    extensions: ["nfo"],
    compressible: null
  },
  "text/x-opml": {
    source: "apache",
    extensions: ["opml"],
    compressible: null
  },
  "text/x-pascal": {
    source: "apache",
    extensions: ["p", "pas"],
    compressible: null
  },
  "text/x-setext": {
    source: "apache",
    extensions: ["etx"],
    compressible: null
  },
  "text/x-sfv": {
    source: "apache",
    extensions: ["sfv"],
    compressible: null
  },
  "text/x-uuencode": {
    source: "apache",
    extensions: ["uu"],
    compressible: null
  },
  "text/x-vcalendar": {
    source: "apache",
    extensions: ["vcs"],
    compressible: null
  },
  "text/x-vcard": {
    source: "apache",
    extensions: ["vcf"],
    compressible: null
  },
  "text/xml": {
    source: "iana",
    compressible: true,
    extensions: ["xml"]
  },
  "video/3gpp": {
    source: "iana",
    extensions: ["3gp", "3gpp"],
    compressible: null
  },
  "video/3gpp2": {
    source: "iana",
    extensions: ["3g2"],
    compressible: null
  },
  "video/h261": {
    source: "iana",
    extensions: ["h261"],
    compressible: null
  },
  "video/h263": {
    source: "iana",
    extensions: ["h263"],
    compressible: null
  },
  "video/h264": {
    source: "iana",
    extensions: ["h264"],
    compressible: null
  },
  "video/iso.segment": {
    source: "iana",
    extensions: ["m4s"],
    compressible: null
  },
  "video/jpeg": {
    source: "iana",
    extensions: ["jpgv"],
    compressible: null
  },
  "video/jpm": {
    source: "apache",
    extensions: ["jpm", "jpgm"],
    compressible: null
  },
  "video/mj2": {
    source: "iana",
    extensions: ["mj2", "mjp2"],
    compressible: null
  },
  "video/mp2t": {
    source: "iana",
    extensions: ["ts"],
    compressible: null
  },
  "video/mp4": {
    source: "iana",
    compressible: false,
    extensions: ["mp4", "mp4v", "mpg4"]
  },
  "video/mpeg": {
    source: "iana",
    compressible: false,
    extensions: ["mpeg", "mpg", "mpe", "m1v", "m2v"]
  },
  "video/ogg": {
    source: "iana",
    compressible: false,
    extensions: ["ogv"]
  },
  "video/quicktime": {
    source: "iana",
    compressible: false,
    extensions: ["qt", "mov"]
  },
  "video/vnd.dece.hd": {
    source: "iana",
    extensions: ["uvh", "uvvh"],
    compressible: null
  },
  "video/vnd.dece.mobile": {
    source: "iana",
    extensions: ["uvm", "uvvm"],
    compressible: null
  },
  "video/vnd.dece.pd": {
    source: "iana",
    extensions: ["uvp", "uvvp"],
    compressible: null
  },
  "video/vnd.dece.sd": {
    source: "iana",
    extensions: ["uvs", "uvvs"],
    compressible: null
  },
  "video/vnd.dece.video": {
    source: "iana",
    extensions: ["uvv", "uvvv"],
    compressible: null
  },
  "video/vnd.dvb.file": {
    source: "iana",
    extensions: ["dvb"],
    compressible: null
  },
  "video/vnd.fvt": {
    source: "iana",
    extensions: ["fvt"],
    compressible: null
  },
  "video/vnd.mpegurl": {
    source: "iana",
    extensions: ["mxu", "m4u"],
    compressible: null
  },
  "video/vnd.ms-playready.media.pyv": {
    source: "iana",
    extensions: ["pyv"],
    compressible: null
  },
  "video/vnd.uvvu.mp4": {
    source: "iana",
    extensions: ["uvu", "uvvu"],
    compressible: null
  },
  "video/vnd.vivo": {
    source: "iana",
    extensions: ["viv"],
    compressible: null
  },
  "video/webm": {
    source: "apache",
    compressible: false,
    extensions: ["webm"]
  },
  "video/x-f4v": {
    source: "apache",
    extensions: ["f4v"],
    compressible: null
  },
  "video/x-fli": {
    source: "apache",
    extensions: ["fli"],
    compressible: null
  },
  "video/x-flv": {
    source: "apache",
    compressible: false,
    extensions: ["flv"]
  },
  "video/x-m4v": {
    source: "apache",
    extensions: ["m4v"],
    compressible: null
  },
  "video/x-matroska": {
    source: "apache",
    compressible: false,
    extensions: ["mkv", "mk3d", "mks"]
  },
  "video/x-mng": {
    source: "apache",
    extensions: ["mng"],
    compressible: null
  },
  "video/x-ms-asf": {
    source: "apache",
    extensions: ["asf", "asx"],
    compressible: null
  },
  "video/x-ms-vob": {
    source: "apache",
    extensions: ["vob"],
    compressible: null
  },
  "video/x-ms-wm": {
    source: "apache",
    extensions: ["wm"],
    compressible: null
  },
  "video/x-ms-wmv": {
    source: "apache",
    compressible: false,
    extensions: ["wmv"]
  },
  "video/x-ms-wmx": {
    source: "apache",
    extensions: ["wmx"],
    compressible: null
  },
  "video/x-ms-wvx": {
    source: "apache",
    extensions: ["wvx"],
    compressible: null
  },
  "video/x-msvideo": {
    source: "apache",
    extensions: ["avi"],
    compressible: null
  },
  "video/x-sgi-movie": {
    source: "apache",
    extensions: ["movie"],
    compressible: null
  },
  "video/x-smv": {
    source: "apache",
    extensions: ["smv"],
    compressible: null
  },
  "x-conference/x-cooltalk": {
    source: "apache",
    extensions: ["ice"],
    compressible: null
  }
};
var chunk_BFQJWQY7_mimeTypes = mimeTypesInternal;


//# sourceMappingURL=chunk-BFQJWQY7.mjs.map
;// CONCATENATED MODULE: ./node_modules/@uploadthing/mime-types/dist/index.mjs


// src/index.ts
function extname(path) {
  const index = path.lastIndexOf(".");
  return index < 0 ? "" : path.substring(index);
}
var extensions = {};
var types = {};
populateMaps(extensions, types);
function dist_lookup(path) {
  if (!path || typeof path !== "string") {
    return false;
  }
  const extension = extname("x." + path).toLowerCase().substring(1);
  if (!extension) {
    return false;
  }
  return types[extension] || false;
}
function populateMaps(extensions2, types2) {
  const preference = ["nginx", "apache", void 0, "iana"];
  Object.keys(chunk_BFQJWQY7_mimeTypes).forEach((type) => {
    const mime = chunk_BFQJWQY7_mimeTypes[type];
    const exts = mime.extensions;
    if (!(exts == null ? void 0 : exts.length)) {
      return;
    }
    extensions2[type] = exts;
    for (const extension of exts) {
      if (types2[extension]) {
        const from = preference.indexOf(chunk_BFQJWQY7_mimeTypes[types2[extension]].source);
        const to = preference.indexOf(mime.source);
        if (types2[extension] !== "application/octet-stream" && (from > to || from === to && types2[extension].startsWith("application/"))) {
          continue;
        }
      }
      types2[extension] = type;
    }
  });
}

/*!
 * mime-types
 * Copyright(c) 2014 Jonathan Ong
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */
//# sourceMappingURL=index.mjs.map
// EXTERNAL MODULE: ./node_modules/zod/lib/index.mjs
var lib = __webpack_require__(19098);
;// CONCATENATED MODULE: ./node_modules/@uploadthing/mime-types/dist/db.mjs


//# sourceMappingURL=db.mjs.map
;// CONCATENATED MODULE: ./node_modules/@uploadthing/shared/dist/index.mjs
// src/utils.ts

function isRouteArray(routeConfig) {
  return Array.isArray(routeConfig);
}
function getDefaultSizeForType(fileType) {
  if (fileType === "image")
    return "4MB";
  if (fileType === "video")
    return "16MB";
  if (fileType === "audio")
    return "8MB";
  if (fileType === "blob")
    return "8MB";
  if (fileType === "pdf")
    return "4MB";
  if (fileType === "text")
    return "64KB";
  return "4MB";
}
function fillInputRouteConfig(routeConfig) {
  if (isRouteArray(routeConfig)) {
    return routeConfig.reduce((acc, fileType) => {
      acc[fileType] = {
        // Apply defaults
        maxFileSize: getDefaultSizeForType(fileType),
        maxFileCount: 1
      };
      return acc;
    }, {});
  }
  const newConfig = {};
  const inputKeys = Object.keys(routeConfig);
  inputKeys.forEach((key) => {
    const value = routeConfig[key];
    if (!value)
      throw new Error("Invalid config during fill");
    const defaultValues = {
      maxFileSize: getDefaultSizeForType(key),
      maxFileCount: 1
    };
    newConfig[key] = { ...defaultValues, ...value };
  }, {});
  return newConfig;
}
function getTypeFromFileName(fileName, allowedTypes) {
  const mimeType = lookup(fileName);
  if (!mimeType) {
    throw new Error(
      `Could not determine type for ${fileName}, presigned URL generation failed`
    );
  }
  if (allowedTypes.some((type2) => type2.includes("/"))) {
    if (allowedTypes.includes(mimeType)) {
      return mimeType;
    }
  }
  const type = mimeType.toLowerCase() === "application/pdf" ? "pdf" : mimeType.split("/")[0];
  if (!allowedTypes.includes(type)) {
    if (allowedTypes.includes("blob")) {
      return "blob";
    } else {
      throw new Error(`File type ${type} not allowed for ${fileName}`);
    }
  }
  return type;
}
function generateUploadThingURL(path) {
  const host = process.env.CUSTOM_INFRA_URL ?? "https://uploadthing.com";
  return `${host}${path}`;
}
var withExponentialBackoff = async (doTheThing, MAXIMUM_BACKOFF_MS = 64 * 1e3, MAX_RETRIES = 20) => {
  let tries = 0;
  let backoffMs = 500;
  let backoffFuzzMs = 0;
  let result = null;
  while (tries <= MAX_RETRIES) {
    result = await doTheThing();
    if (result !== null)
      return result;
    tries += 1;
    backoffMs = Math.min(MAXIMUM_BACKOFF_MS, backoffMs * 2);
    backoffFuzzMs = Math.floor(Math.random() * 500);
    if (tries > 3) {
      console.error(
        `[UT] Call unsuccessful after ${tries} tries. Retrying in ${Math.floor(
          backoffMs / 1e3
        )} seconds...`
      );
    }
    await new Promise((r) => setTimeout(r, backoffMs + backoffFuzzMs));
  }
  return null;
};
async function pollForFileData(fileKey, callback) {
  const queryUrl = generateUploadThingURL(`/api/pollUpload/${fileKey}`);
  return withExponentialBackoff(async () => {
    const res = await fetch(queryUrl);
    const json = await res.json();
    if (json.status !== "done")
      return null;
    await (callback == null ? void 0 : callback(json));
  });
}
function getUploadthingUrl() {
  const uturl = process.env.UPLOADTHING_URL;
  if (uturl)
    return `${uturl}/api/uploadthing`;
  const vcurl = process.env.VERCEL_URL;
  if (vcurl)
    return `https://${vcurl}/api/uploadthing`;
  return `http://localhost:${process.env.PORT ?? 3e3}/api/uploadthing`;
}
var FILESIZE_UNITS = (/* unused pure expression or super */ null && (["B", "KB", "MB", "GB"]));
var fileSizeToBytes = (input) => {
  const regex = new RegExp(
    `^(\\d+)(\\.\\d+)?\\s*(${FILESIZE_UNITS.join("|")})$`,
    "i"
  );
  const match = input.match(regex);
  if (!match) {
    return new Error("Invalid file size format");
  }
  const sizeValue = parseFloat(match[1]);
  const sizeUnit = match[3].toUpperCase();
  if (!FILESIZE_UNITS.includes(sizeUnit)) {
    throw new Error("Invalid file size unit");
  }
  const bytes = sizeValue * Math.pow(1024, FILESIZE_UNITS.indexOf(sizeUnit));
  return Math.floor(bytes);
};

// src/file-types.ts


var ALLOWED_FILE_TYPES = [
  "image",
  "video",
  "audio",
  "pdf",
  "text",
  "blob"
];
function zodEnumFromObjKeys(obj) {
  const [firstKey, ...otherKeys] = Object.keys(obj);
  return lib/* enum */.Km([firstKey, ...otherKeys]);
}
var MimeTypeZod = zodEnumFromObjKeys(chunk_BFQJWQY7_mimeTypes);
var InternalFileTypeValidator = lib/* enum */.Km(ALLOWED_FILE_TYPES);
var InternalMimeTypeValidator = MimeTypeZod;
var CombinedTypeValidator = lib/* union */.G0([
  InternalFileTypeValidator,
  InternalMimeTypeValidator
]);

// src/error.ts
var ERROR_CODES = {
  // Generic
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  FORBIDDEN: 403,
  INTERNAL_SERVER_ERROR: 500,
  INTERNAL_CLIENT_ERROR: 500,
  // S3 specific
  TOO_LARGE: 413,
  TOO_SMALL: 400,
  TOO_MANY_FILES: 400,
  KEY_TOO_LONG: 400,
  // UploadThing specific
  URL_GENERATION_FAILED: 500,
  UPLOAD_FAILED: 500,
  MISSING_ENV: 500,
  FILE_LIMIT_EXCEEDED: 500
};
function messageFromUnknown(cause, fallback) {
  if (typeof cause === "string") {
    return cause;
  }
  if (cause instanceof Error) {
    return cause.message;
  }
  if (cause && typeof cause === "object" && "message" in cause && typeof cause.message === "string") {
    return cause.message;
  }
  return fallback ?? "An unknown error occurred";
}
var UploadThingError = class extends Error {
  constructor(opts) {
    const message = opts.message ?? messageFromUnknown(opts.cause, opts.code);
    super(message);
    this.code = opts.code;
    this.data = opts.data;
    if (opts.cause instanceof Error) {
      this.cause = opts.cause;
    } else if (opts.cause instanceof Response) {
      this.cause = new Error(
        `Response ${opts.cause.status} ${opts.cause.statusText}`
      );
    } else if (typeof opts.cause === "string") {
      this.cause = new Error(opts.cause);
    } else {
      this.cause = void 0;
    }
  }
  static async fromResponse(response) {
    const json = await response.json();
    let message = void 0;
    if (json !== null && typeof json === "object" && !Array.isArray(json)) {
      if (typeof json.message === "string") {
        message = json.message;
      } else if (typeof json.error === "string") {
        message = json.error;
      }
    }
    return new UploadThingError({
      message,
      code: getErrorTypeFromStatusCode(response.status),
      cause: response,
      data: json
    });
  }
  static toObject(error) {
    return {
      code: error.code,
      message: error.message,
      data: error.data
    };
  }
  static serialize(error) {
    return JSON.stringify(UploadThingError.toObject(error));
  }
};
function getStatusCodeFromError(error) {
  return ERROR_CODES[error.code] ?? 500;
}
function getErrorTypeFromStatusCode(statusCode) {
  for (const [code, status] of Object.entries(ERROR_CODES)) {
    if (status === statusCode) {
      return code;
    }
  }
  return "INTERNAL_SERVER_ERROR";
}

//# sourceMappingURL=index.mjs.map
;// CONCATENATED MODULE: ./node_modules/uploadthing/dist/chunk-5KWT532U.mjs
// src/internal/s3-error-parser.ts
var maybeParseResponseXML = (maybeXml) => {
  const codeMatch = maybeXml.match(/<Code>(.*?)<\/Code>/s);
  const messageMatch = maybeXml.match(/<Message>(.*?)<\/Message>/s);
  const code = codeMatch == null ? void 0 : codeMatch[1];
  const message = messageMatch == null ? void 0 : messageMatch[1];
  if (!code || !message)
    return null;
  return { code: s3CodeToUploadThingCode[code] ?? DEFAULT_ERROR_CODE, message };
};
var DEFAULT_ERROR_CODE = "UPLOAD_FAILED";
var s3CodeToUploadThingCode = {
  AccessDenied: "FORBIDDEN",
  // 403 Forbidden
  EntityTooSmall: "TOO_SMALL",
  // 400 Bad Request
  EntityTooLarge: "TOO_LARGE",
  // 400 Bad Request
  ExpiredToken: "FORBIDDEN",
  // 400 Bad Request
  IncorrectNumberOfFilesInPostRequest: "TOO_MANY_FILES",
  // 400 Bad Request
  InternalError: "INTERNAL_SERVER_ERROR",
  // 500 Internal Server Error
  KeyTooLongError: "KEY_TOO_LONG",
  // 400 Bad Request
  MaxMessageLengthExceeded: "TOO_LARGE"
  // 400 Bad Request
};


//# sourceMappingURL=chunk-5KWT532U.mjs.map
;// CONCATENATED MODULE: ./node_modules/uploadthing/dist/chunk-QTCNM7DJ.mjs
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));


//# sourceMappingURL=chunk-QTCNM7DJ.mjs.map
;// CONCATENATED MODULE: ./node_modules/uploadthing/dist/client.mjs



// src/client.ts

function fetchWithProgress(url, opts = {}, onProgress, onUploadBegin) {
  return new Promise((res, rej) => {
    const xhr = new XMLHttpRequest();
    xhr.open(opts.method ?? "get", url);
    opts.headers && Object.keys(opts.headers).forEach(
      (h) => opts.headers && xhr.setRequestHeader(h, opts.headers.get(h) ?? "")
    );
    xhr.onload = (e) => {
      res(e.target);
    };
    xhr.onerror = rej;
    if (xhr.upload && onProgress)
      xhr.upload.onprogress = onProgress;
    if (xhr.upload && onUploadBegin)
      xhr.upload.onloadstart = onUploadBegin;
    xhr.send(opts.body);
  });
}
var createAPIRequestUrl = (config) => {
  const url = new URL(
    config.url ?? `${window.location.origin}/api/uploadthing`
  );
  const queryParams = new URLSearchParams(url.search);
  queryParams.set("actionType", config.actionType);
  queryParams.set("slug", config.slug);
  url.search = queryParams.toString();
  return url.toString();
};
var DANGEROUS__uploadFiles = async (opts, config) => {
  const s3ConnectionRes = await fetch(
    createAPIRequestUrl({
      url: config == null ? void 0 : config.url,
      slug: String(opts.endpoint),
      actionType: "upload"
    }),
    {
      method: "POST",
      body: JSON.stringify({
        files: opts.files.map((f) => f.name),
        input: opts.input
      })
    }
  ).then(async (res) => {
    if (!res.ok) {
      const error = await UploadThingError.fromResponse(res);
      throw error;
    }
    try {
      return res.json();
    } catch (e) {
      console.error(e);
      throw new UploadThingError({
        code: "BAD_REQUEST",
        message: `Failed to parse response as JSON. Got: ${await res.text()}`,
        cause: e
      });
    }
  });
  if (!s3ConnectionRes || !Array.isArray(s3ConnectionRes)) {
    throw new UploadThingError({
      code: "BAD_REQUEST",
      message: "No URL. How did you even get here?",
      cause: s3ConnectionRes
    });
  }
  const fileUploadPromises = s3ConnectionRes.map(async (presigned) => {
    const file = opts.files.find((f) => f.name === presigned.name);
    if (!file) {
      console.error("No file found for presigned URL", presigned);
      throw new UploadThingError({
        code: "NOT_FOUND",
        message: "No file found for presigned URL",
        cause: `Expected file with name ${presigned.name} but got '${opts.files.join(",")}'`
      });
    }
    const { url, fields } = presigned.presignedUrl;
    const formData = new FormData();
    if (presigned.fileType === file.type.split("/")[0] || presigned.fileType === file.type) {
      formData.append("Content-Type", file.type);
    } else if (presigned.fileType === "blob") {
      formData.append("Content-Type", "application/octet-stream");
    } else if (presigned.fileType === "pdf") {
      formData.append("Content-Type", "application/pdf");
    }
    Object.entries({ ...fields, file }).forEach(([key, value]) => {
      formData.append(key, value);
    });
    const upload = await fetchWithProgress(
      url,
      {
        method: "POST",
        body: formData,
        headers: new Headers({
          Accept: "application/xml"
        })
      },
      (progressEvent) => opts.onUploadProgress && opts.onUploadProgress({
        file: file.name,
        progress: progressEvent.loaded / progressEvent.total * 100
      }),
      () => {
        opts.onUploadBegin && opts.onUploadBegin({
          file: file.name
        });
      }
    );
    if (upload.status > 299 || upload.status < 200) {
      await fetch(
        createAPIRequestUrl({
          url: config == null ? void 0 : config.url,
          slug: String(opts.endpoint),
          actionType: "failure"
        }),
        {
          method: "POST",
          body: JSON.stringify({
            fileKey: fields.key
          })
        }
      );
      const parsed = maybeParseResponseXML(upload.responseText);
      if (parsed == null ? void 0 : parsed.message) {
        throw new UploadThingError({
          code: parsed.code,
          message: parsed.message
        });
      } else {
        throw new UploadThingError({
          code: "UPLOAD_FAILED",
          message: `Failed to upload file ${file.name} to S3`,
          cause: upload.responseText
        });
      }
    }
    const genUrl = "https://utfs.io/f/" + encodeURIComponent(fields.key);
    await pollForFileData(presigned.key);
    const ret = {
      fileName: file.name,
      name: file.name,
      fileSize: file.size,
      size: file.size,
      fileKey: presigned.key,
      key: presigned.key,
      fileUrl: genUrl,
      url: genUrl
    };
    return ret;
  });
  return Promise.all(fileUploadPromises);
};
var genUploader = () => {
  return DANGEROUS__uploadFiles;
};
var classNames = (...classes) => {
  return classes.filter(Boolean).join(" ");
};
var generateMimeTypes = (fileTypes) => {
  const accepted = fileTypes.map((type) => {
    if (type === "blob")
      return "blob";
    if (type === "pdf")
      return "application/pdf";
    if (type.includes("/"))
      return type;
    else
      return `${type}/*`;
  });
  if (accepted.includes("blob")) {
    return void 0;
  }
  return accepted;
};
var generateClientDropzoneAccept = (fileTypes) => {
  const mimeTypes = generateMimeTypes(fileTypes);
  if (!mimeTypes)
    return void 0;
  return Object.fromEntries(mimeTypes.map((type) => [type, []]));
};

//# sourceMappingURL=client.mjs.map
;// CONCATENATED MODULE: ./node_modules/@uploadthing/react/dist/chunk-FSXQNOLN.mjs
"use client";

// src/useUploadThing.ts




// src/utils/useEvent.ts

var noop = () => void 0;
var useInsertionEffect = typeof window !== "undefined" ? (
  // useInsertionEffect is available in React 18+
  react_experimental_.useInsertionEffect || react_experimental_.useLayoutEffect
) : noop;
function useEvent(callback) {
  const latestRef = react_experimental_.useRef(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    useEvent_shouldNotBeInvokedBeforeMount
  );
  useInsertionEffect(() => {
    latestRef.current = callback;
  }, [callback]);
  const stableRef = react_experimental_.useRef();
  if (!stableRef.current) {
    stableRef.current = function() {
      return latestRef.current.apply(this, arguments);
    };
  }
  return stableRef.current;
}
function useEvent_shouldNotBeInvokedBeforeMount() {
  throw new Error(
    "INVALID_USEEVENT_INVOCATION: the callback from useEvent cannot be invoked before the component has mounted."
  );
}

// src/utils/useFetch.ts

function useFetch(url, options) {
  const cache = (0,react_experimental_.useRef)({});
  const cancelRequest = (0,react_experimental_.useRef)(false);
  const initialState = {
    error: void 0,
    data: void 0
  };
  const fetchReducer = (state2, action) => {
    switch (action.type) {
      case "loading":
        return { ...initialState };
      case "fetched":
        return { ...initialState, data: action.payload };
      case "error":
        return { ...initialState, error: action.payload };
      default:
        return state2;
    }
  };
  const [state, dispatch] = (0,react_experimental_.useReducer)(fetchReducer, initialState);
  (0,react_experimental_.useEffect)(() => {
    if (!url)
      return;
    cancelRequest.current = false;
    const fetchData = async () => {
      dispatch({ type: "loading" });
      if (cache.current[url]) {
        dispatch({ type: "fetched", payload: cache.current[url] });
        return;
      }
      try {
        const response = await fetch(url, options);
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        const data = await response.json();
        cache.current[url] = data;
        if (cancelRequest.current)
          return;
        dispatch({ type: "fetched", payload: data });
      } catch (error) {
        if (cancelRequest.current)
          return;
        dispatch({ type: "error", payload: error });
      }
    };
    void fetchData();
    return () => {
      cancelRequest.current = true;
    };
  }, [url]);
  return state;
}
var useFetch_default = useFetch;

// src/useUploadThing.ts
var useEndpointMetadata = (endpoint) => {
  const { data } = useFetch_default("/api/uploadthing");
  return data == null ? void 0 : data.find((x) => x.slug === endpoint);
};
var fatalClientError = (e) => new UploadThingError({
  code: "INTERNAL_CLIENT_ERROR",
  message: "Something went wrong. Please report this to UploadThing.",
  cause: e
});
var INTERNAL_uploadthingHookGen = () => {
  const useUploadThing = (endpoint, opts) => {
    const [isUploading, setUploading] = (0,react_experimental_.useState)(false);
    const uploadProgress = (0,react_experimental_.useRef)(0);
    const fileProgress = (0,react_experimental_.useRef)(/* @__PURE__ */ new Map());
    const permittedFileInfo = useEndpointMetadata(endpoint);
    const startUpload = useEvent(async (...args) => {
      var _a, _b;
      const [files, input] = args;
      setUploading(true);
      try {
        const res = await DANGEROUS__uploadFiles({
          files,
          endpoint,
          input,
          onUploadProgress: (progress) => {
            var _a2;
            if (!(opts == null ? void 0 : opts.onUploadProgress))
              return;
            fileProgress.current.set(progress.file, progress.progress);
            let sum = 0;
            fileProgress.current.forEach((p) => {
              sum += p;
            });
            const averageProgress = Math.floor(sum / fileProgress.current.size / 10) * 10;
            if (averageProgress !== uploadProgress.current) {
              (_a2 = opts == null ? void 0 : opts.onUploadProgress) == null ? void 0 : _a2.call(opts, averageProgress);
              uploadProgress.current = averageProgress;
            }
          },
          onUploadBegin({ file }) {
            if (!(opts == null ? void 0 : opts.onUploadBegin))
              return;
            opts.onUploadBegin(file);
          }
        });
        (_a = opts == null ? void 0 : opts.onClientUploadComplete) == null ? void 0 : _a.call(opts, res);
        return res;
      } catch (e) {
        const error = e instanceof UploadThingError ? e : fatalClientError(e);
        (_b = opts == null ? void 0 : opts.onUploadError) == null ? void 0 : _b.call(
          opts,
          error
        );
      } finally {
        setUploading(false);
        fileProgress.current = /* @__PURE__ */ new Map();
        uploadProgress.current = 0;
      }
    });
    return {
      startUpload,
      isUploading,
      permittedFileInfo
    };
  };
  return useUploadThing;
};
var generateReactHelpers = () => {
  return {
    useUploadThing: INTERNAL_uploadthingHookGen(),
    uploadFiles: DANGEROUS__uploadFiles
  };
};


//# sourceMappingURL=chunk-FSXQNOLN.mjs.map
;// CONCATENATED MODULE: ./node_modules/@uploadthing/react/dist/hooks.mjs
"use client";


//# sourceMappingURL=hooks.mjs.map

/***/ })

};
;