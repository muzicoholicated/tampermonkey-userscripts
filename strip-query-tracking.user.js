
// ==UserScript==
// @name         Strip Tracking Query Params
// @namespace    pk.tampermonkey.cleaner
// @version      1.0
// @description  Removes tracking query string variables from URLs using the URL object
// @match        *://*/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function () {
	'use strict';

	// Exact param names to remove
	const EXACT_PARAMS = [
		'~ad_id',
		'~ad_name',
		'ad_id',
		'bcndyn',
		'campaign_id',
		'fad_id',
		'fbclid',
		'http_ref',
		'js_challenge',
		'share_id',
		'xmt',
	];

	// Prefixes to match (any param starting with these gets removed)
	const PREFIX_PARAMS = [
		'tw_',
		'utm_',
		'jsc_'
	];

	function shouldRemove(paramName) {
		if (EXACT_PARAMS.includes(paramName)) return true;
		return PREFIX_PARAMS.some(prefix => paramName.startsWith(prefix));
	}

	function cleanUrl(url) {
		let urlObj;
		try {
			urlObj = new URL(url);
		} catch (e) {
			return null; // not a valid URL, skip
		}

		const params = urlObj.searchParams;
		const keysToDelete = [];

		for (const key of params.keys()) {
			if (shouldRemove(key)) {
				keysToDelete.push(key);
			}
		}

		if (keysToDelete.length === 0) return null;

		keysToDelete.forEach(key => params.delete(key));
		return urlObj.toString();
	}

	const cleaned = cleanUrl(window.location.href);
	if (cleaned && cleaned !== window.location.href) {
		window.history.replaceState(null, '', cleaned);
	}
})();

