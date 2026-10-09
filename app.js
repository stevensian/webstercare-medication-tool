var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
(function () {
    var $ = function (id) { return document.getElementById(id); };
    var state = {
        operator: "",
        drugName: "",
        strength: "",
        barcode: "",
        packaging: "",
        material: "",
        rows: "",
        captureDate: "",
        finishTime: "",
        ocrStream: null,
        barcodeStream: null,
        barcodeReader: null,
        scanActive: false
    };
    var tesseractLoadPromise = null;
    var zxingLoadPromise = null;
    function loadExternalScript(src, globalName) {
        if (window[globalName])
            return Promise.resolve(window[globalName]);
        return new Promise(function (resolve, reject) {
            var script = document.createElement("script");
            script.src = src;
            script.async = true;
            script.onload = function () { return window[globalName] ? resolve(window[globalName]) : reject(new Error(globalName + " did not load")); };
            script.onerror = function () { return reject(new Error("Could not load " + src)); };
            document.head.appendChild(script);
        });
    }
    function ensureTesseract() {
        if (!tesseractLoadPromise) {
            tesseractLoadPromise = loadExternalScript("https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js", "Tesseract");
        }
        return tesseractLoadPromise;
    }
    function ensureZXing() {
        if (!zxingLoadPromise) {
            zxingLoadPromise = loadExternalScript("https://unpkg.com/@zxing/library@0.21.3/umd/index.min.js", "ZXing");
        }
        return zxingLoadPromise;
    }
    function show(id) { $(id).classList.remove("hidden"); }
    function hide(id) { $(id).classList.add("hidden"); }
    function setStatus(id, text, cls) {
        if (cls === void 0) { cls = ""; }
        var el = $(id);
        el.textContent = text || "";
        el.className = "status" + (cls ? " " + cls : "");
    }
    function localDateString(d) {
        if (d === void 0) { d = new Date(); }
        return new Intl.DateTimeFormat("en-AU", {
            year: "numeric", month: "2-digit", day: "2-digit"
        }).format(d);
    }
    function localTimeString(d) {
        if (d === void 0) { d = new Date(); }
        return new Intl.DateTimeFormat("en-AU", {
            hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false
        }).format(d);
    }
    function escapeHtml(s) {
        return String(s == null ? "" : s)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
    function summaryHtml(includePackaging) {
        if (includePackaging === void 0) { includePackaging = false; }
        var rows = "\n      <div class=\"summary-item\"><div class=\"summary-label\">Drug Name</div><div class=\"summary-value\">".concat(escapeHtml(state.drugName), "</div></div>\n      <div class=\"summary-item\"><div class=\"summary-label\">Strength</div><div class=\"summary-value\">").concat(escapeHtml(state.strength), "</div></div>\n    ");
        if (state.barcode) {
            rows += "<div class=\"summary-item\"><div class=\"summary-label\">EAN-13 Barcode</div><div class=\"summary-value\">".concat(escapeHtml(state.barcode), "</div></div>");
        }
        if (includePackaging && state.packaging) {
            rows += "<div class=\"summary-item\"><div class=\"summary-label\">Packaging</div><div class=\"summary-value\">".concat(escapeHtml(state.packaging), "</div></div>");
            if (state.packaging === "Blister") {
                rows += "<div class=\"summary-item\"><div class=\"summary-label\">Material</div><div class=\"summary-value\">".concat(escapeHtml(state.material), "</div></div>");
                rows += "<div class=\"summary-item\"><div class=\"summary-label\">Rows</div><div class=\"summary-value\">".concat(escapeHtml(state.rows), "</div></div>");
            }
        }
        return rows;
    }
    function stopStream(stream) {
        if (stream)
            stream.getTracks().forEach(function (t) { return t.stop(); });
    }
    function getRearCameraStream() {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, navigator.mediaDevices.getUserMedia({
                        video: {
                            facingMode: { ideal: "environment" },
                            width: { ideal: 1920 },
                            height: { ideal: 1080 },
                            focusMode: { ideal: "continuous" }
                        },
                        audio: false
                    })];
            });
        });
    }
    function preprocessCanvas(sourceVideo, canvas) {
        var maxW = 1600;
        var w = sourceVideo.videoWidth || 1280;
        var h = sourceVideo.videoHeight || 720;
        if (w > maxW) {
            h = Math.round(h * maxW / w);
            w = maxW;
        }
        canvas.width = w;
        canvas.height = h;
        var ctx = canvas.getContext("2d", { willReadFrequently: true });
        ctx.drawImage(sourceVideo, 0, 0, w, h);
        var image = ctx.getImageData(0, 0, w, h);
        var d = image.data;
        for (var i = 0; i < d.length; i += 4) {
            var gray = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
            var boosted = gray > 170 ? 255 : gray < 65 ? 0 : Math.min(255, Math.max(0, (gray - 128) * 1.35 + 128));
            d[i] = d[i + 1] = d[i + 2] = boosted;
        }
        ctx.putImageData(image, 0, 0);
    }
    function parseDrugAndStrength(text) {
        var cleaned = text
            .replace(/[|]/g, "I")
            .replace(/\s+/g, " ")
            .trim();
        var strengthPatterns = [
            /\b\d+(?:\.\d+)?\s?(?:mg|mcg|µg|ug|g|mL|ml|%)(?:\s*\/\s*\d+(?:\.\d+)?\s?(?:mL|ml))?\b/i,
            /\b\d+(?:\.\d+)?\s?(?:mg|mcg|µg|ug|g)\b/i
        ];
        var strength = "";
        for (var _i = 0, strengthPatterns_1 = strengthPatterns; _i < strengthPatterns_1.length; _i++) {
            var p = strengthPatterns_1[_i];
            var m = cleaned.match(p);
            if (m) {
                strength = m[0].replace(/\s+/g, " ").trim();
                break;
            }
        }
        var rawLines = text.split(/\r?\n/).map(function (s) { return s.trim(); }).filter(Boolean);
        var lines = rawLines
            .map(function (s) { return s.replace(/[^\w\s\-+()./%µ]/g, " ").replace(/\s+/g, " ").trim(); })
            .filter(function (s) { return s.length >= 3; });
        var badWords = /(expiry|exp\b|batch|lot\b|barcode|ean|gtin|tablet|capsule|film-coated|keep|store|warning|ingredients|sponsor|aust r|aust l|prescription|pharmacy|date)/i;
        var candidates = lines.filter(function (line) {
            return !badWords.test(line) &&
                /[A-Za-z]{3,}/.test(line) &&
                line.length <= 60;
        });
        if (strength) {
            var exactStrength_1 = strength.toLowerCase();
            candidates = candidates.map(function (c) { return c.replace(new RegExp(exactStrength_1.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'ig'), "").trim(); })
                .filter(function (c) { return c.length >= 3; });
        }
        candidates.sort(function (a, b) {
            var score = function (s) {
                var x = 0;
                if (/^[A-Z][A-Za-z\-]+/.test(s))
                    x += 2;
                if (s.split(" ").length <= 5)
                    x += 2;
                if (!/\d{4,}/.test(s))
                    x += 1;
                x += Math.min(s.length, 30) / 30;
                return x;
            };
            return score(b) - score(a);
        });
        var drugName = candidates[0] || "";
        if (drugName.length > 50)
            drugName = drugName.slice(0, 50);
        return { drugName: drugName, strength: strength, cleaned: cleaned };
    }
    function isValidEAN13(code) {
        if (!/^\d{13}$/.test(code))
            return false;
        var digits = code.split("").map(Number);
        var sum = 0;
        for (var i = 0; i < 12; i++) {
            sum += digits[i] * (i % 2 === 0 ? 1 : 3);
        }
        var check = (10 - (sum % 10)) % 10;
        return check === digits[12];
    }
    function getRecords() {
        try {
            return JSON.parse(localStorage.getItem("webstercareMedicationMeasurements") || "[]");
        }
        catch (e) {
            return [];
        }
    }
    function saveRecords(records) {
        localStorage.setItem("webstercareMedicationMeasurements", JSON.stringify(records));
    }
    function renderRecords() {
        var records = getRecords();
        $("recordsBody").innerHTML = records.length ? records.map(function (r) { return "\n      <tr>\n        <td>".concat(escapeHtml(r.operator), "</td>\n        <td>").concat(escapeHtml(r.drugName), "</td>\n        <td>").concat(escapeHtml(r.strength), "</td>\n        <td>").concat(escapeHtml(r.barcode), "</td>\n        <td>").concat(escapeHtml(r.packaging), "</td>\n        <td>").concat(escapeHtml(r.material || ""), "</td>\n        <td>").concat(escapeHtml(r.rows || ""), "</td>\n        <td>").concat(escapeHtml(r.captureDate), "</td>\n        <td>").concat(escapeHtml(r.finishTime), "</td>\n      </tr>\n    "); }).join("") : "<tr><td colspan=\"9\">No measurements stored yet.</td></tr>";
    }
    function resetEntry(keepOperator) {
        if (keepOperator === void 0) { keepOperator = true; }
        stopStream(state.ocrStream);
        stopStream(state.barcodeStream);
        if (state.barcodeReader) {
            try {
                state.barcodeReader.reset();
            }
            catch (e) { }
        }
        var op = keepOperator ? $("operator").value : "";
        Object.assign(state, {
            operator: op,
            drugName: "",
            strength: "",
            barcode: "",
            packaging: "",
            material: "",
            rows: "",
            captureDate: "",
            finishTime: "",
            ocrStream: null,
            barcodeStream: null,
            barcodeReader: null,
            scanActive: false
        });
        $("drugName").value = "";
        $("strength").value = "";
        $("manualBarcode").value = "";
        $("ocrCanvas").classList.add("hidden");
        hide("ocrFields");
        hide("ocrCameraWrap");
        hide("ocrCameraButtons");
        hide("barcodeCameraWrap");
        hide("barcodeButtons");
        hide("manualBarcodeWrap");
        hide("blisterOptions");
        hide("saveEntryBtn");
        setStatus("ocrStatus", "");
        setStatus("barcodeStatus", "");
        document.querySelectorAll(".choice.selected").forEach(function (b) { return b.classList.remove("selected"); });
    }
    $("startBtn").addEventListener("click", function () {
        var op = $("operator").value;
        if (!op) {
            alert("Please select your name.");
            return;
        }
        resetEntry(true);
        state.operator = op;
        state.captureDate = localDateString();
        hide("userCard");
        hide("savedCard");
        show("identifyCard");
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
    $("openOcrCameraBtn").addEventListener("click", function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, e_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    setStatus("ocrStatus", "Opening camera...");
                    _a = state;
                    return [4 /*yield*/, getRearCameraStream()];
                case 1:
                    _a.ocrStream = _b.sent();
                    $("ocrVideo").srcObject = state.ocrStream;
                    show("ocrCameraWrap");
                    show("ocrCameraButtons");
                    hide("openOcrCameraBtn");
                    setStatus("ocrStatus", "Hold the medication label steady and fill most of the frame.");
                    return [3 /*break*/, 3];
                case 2:
                    e_1 = _b.sent();
                    console.error(e_1);
                    setStatus("ocrStatus", "Camera access failed. On iPhone, open this app over HTTPS and allow Camera permission.", "err");
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    $("cancelOcrCameraBtn").addEventListener("click", function () {
        stopStream(state.ocrStream);
        state.ocrStream = null;
        hide("ocrCameraWrap");
        hide("ocrCameraButtons");
        show("openOcrCameraBtn");
        setStatus("ocrStatus", "");
    });
    $("captureOcrBtn").addEventListener("click", function () { return __awaiter(_this, void 0, void 0, function () {
        var video, result, parsed, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    video = $("ocrVideo");
                    if (!video.videoWidth)
                        return [2 /*return*/];
                    preprocessCanvas(video, $("ocrCanvas"));
                    show("ocrCanvas");
                    stopStream(state.ocrStream);
                    state.ocrStream = null;
                    hide("ocrCameraWrap");
                    hide("ocrCameraButtons");
                    show("openOcrCameraBtn");
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, 5, 6]);
                    show("ocrProgress");
                    $("ocrProgressBar").style.width = "0%";
                    setStatus("ocrStatus", "Reading medication label...");
                    return [4 /*yield*/, ensureTesseract()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, Tesseract.recognize($("ocrCanvas"), "eng", {
                            logger: function (m) {
                                if (m.status === "recognizing text" && typeof m.progress === "number") {
                                    $("ocrProgressBar").style.width = Math.round(m.progress * 100) + "%";
                                    setStatus("ocrStatus", "Reading medication label... ".concat(Math.round(m.progress * 100), "%"));
                                }
                            }
                        })];
                case 3:
                    result = _a.sent();
                    parsed = parseDrugAndStrength(result.data.text || "");
                    $("drugName").value = parsed.drugName;
                    $("strength").value = parsed.strength;
                    show("ocrFields");
                    setStatus("ocrStatus", "OCR completed. Please check and correct the Drug Name and Strength.", "ok");
                    return [3 /*break*/, 6];
                case 4:
                    e_2 = _a.sent();
                    console.error(e_2);
                    show("ocrFields");
                    setStatus("ocrStatus", "OCR could not confidently read the label. Please enter Drug Name and Strength manually.", "err");
                    return [3 /*break*/, 6];
                case 5:
                    hide("ocrProgress");
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); });
    $("retakeDrugBtn").addEventListener("click", function () {
        $("drugName").value = "";
        $("strength").value = "";
        hide("ocrFields");
        $("ocrCanvas").classList.add("hidden");
        setStatus("ocrStatus", "");
    });
    $("confirmDrugBtn").addEventListener("click", function () {
        var drugName = $("drugName").value.trim();
        var strength = $("strength").value.trim();
        if (!drugName || !strength) {
            alert("Please confirm both Drug Name and Strength.");
            return;
        }
        state.drugName = drugName;
        state.strength = strength;
        $("topSummary").innerHTML = summaryHtml(false);
        hide("identifyCard");
        show("barcodeCard");
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
    function beginBarcodeScan() {
        return __awaiter(this, void 0, void 0, function () {
            var hints, formats, devices, deviceId, rear, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        state.scanActive = true;
                        setStatus("barcodeStatus", "Opening barcode camera...");
                        show("barcodeCameraWrap");
                        show("barcodeButtons");
                        hide("openBarcodeCameraBtn");
                        return [4 /*yield*/, ensureZXing()];
                    case 1:
                        _a.sent();
                        if (!window.ZXing) return [3 /*break*/, 4];
                        hints = new Map();
                        formats = [ZXing.BarcodeFormat.EAN_13];
                        hints.set(ZXing.DecodeHintType.POSSIBLE_FORMATS, formats);
                        state.barcodeReader = new ZXing.BrowserMultiFormatReader(hints);
                        return [4 /*yield*/, state.barcodeReader.listVideoInputDevices()];
                    case 2:
                        devices = _a.sent();
                        deviceId = undefined;
                        if (devices.length) {
                            rear = devices.find(function (d) { return /back|rear|environment/i.test(d.label); });
                            deviceId = (rear || devices[devices.length - 1]).deviceId;
                        }
                        return [4 /*yield*/, state.barcodeReader.decodeFromVideoDevice(deviceId, $("barcodeVideo"), function (result, err) {
                                if (!state.scanActive)
                                    return;
                                if (result) {
                                    var text = result.getText();
                                    if (isValidEAN13(text)) {
                                        handleBarcode(text);
                                    }
                                    else {
                                        setStatus("barcodeStatus", "Barcode seen (".concat(text, ") but it is not a valid EAN-13. Keep scanning."), "err");
                                    }
                                }
                            })];
                    case 3:
                        _a.sent();
                        setStatus("barcodeStatus", "Scanning for an EAN-13 barcode...");
                        return [3 /*break*/, 5];
                    case 4: throw new Error("ZXing barcode library not available");
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        e_3 = _a.sent();
                        console.error(e_3);
                        setStatus("barcodeStatus", "Automatic barcode scanning is unavailable. Use manual entry below.", "err");
                        show("manualBarcodeWrap");
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        });
    }
    function stopBarcodeScan() {
        state.scanActive = false;
        if (state.barcodeReader) {
            try {
                state.barcodeReader.reset();
            }
            catch (e) { }
        }
        stopStream(state.barcodeStream);
        state.barcodeStream = null;
    }
    function handleBarcode(code) {
        if (!isValidEAN13(code)) {
            setStatus("barcodeStatus", "That number is not a valid EAN-13 barcode.", "err");
            return;
        }
        state.barcode = code;
        stopBarcodeScan();
        setStatus("barcodeStatus", "EAN-13 captured: ".concat(code), "ok");
        hide("barcodeCameraWrap");
        hide("barcodeButtons");
        hide("manualBarcodeWrap");
        $("packagingSummary").innerHTML = summaryHtml(false);
        hide("barcodeCard");
        show("packagingCard");
        window.scrollTo({ top: 0, behavior: "smooth" });
    }
    $("openBarcodeCameraBtn").addEventListener("click", beginBarcodeScan);
    $("cancelBarcodeBtn").addEventListener("click", function () {
        stopBarcodeScan();
        hide("barcodeCameraWrap");
        hide("barcodeButtons");
        show("openBarcodeCameraBtn");
        setStatus("barcodeStatus", "");
    });
    $("manualBarcodeBtn").addEventListener("click", function () {
        show("manualBarcodeWrap");
    });
    $("saveManualBarcodeBtn").addEventListener("click", function () {
        var code = $("manualBarcode").value.replace(/\D/g, "");
        if (!isValidEAN13(code)) {
            setStatus("barcodeStatus", "Please enter a valid 13-digit EAN-13 barcode.", "err");
            return;
        }
        handleBarcode(code);
    });
    document.querySelectorAll("[data-packaging]").forEach(function (btn) {
        btn.addEventListener("click", function () {
            document.querySelectorAll("[data-packaging]").forEach(function (b) { return b.classList.remove("selected"); });
            btn.classList.add("selected");
            state.packaging = btn.dataset.packaging;
            if (state.packaging === "Bottle") {
                state.material = "";
                state.rows = "";
                hide("blisterOptions");
                show("saveEntryBtn");
            }
            else {
                state.material = "";
                state.rows = "";
                show("blisterOptions");
                hide("saveEntryBtn");
                document.querySelectorAll("[data-material],[data-rows]").forEach(function (b) { return b.classList.remove("selected"); });
            }
        });
    });
    document.querySelectorAll("[data-material]").forEach(function (btn) {
        btn.addEventListener("click", function () {
            document.querySelectorAll("[data-material]").forEach(function (b) { return b.classList.remove("selected"); });
            btn.classList.add("selected");
            state.material = btn.dataset.material;
            if (state.rows)
                show("saveEntryBtn");
        });
    });
    document.querySelectorAll("[data-rows]").forEach(function (btn) {
        btn.addEventListener("click", function () {
            document.querySelectorAll("[data-rows]").forEach(function (b) { return b.classList.remove("selected"); });
            btn.classList.add("selected");
            state.rows = btn.dataset.rows;
            if (state.material)
                show("saveEntryBtn");
        });
    });
    $("saveEntryBtn").addEventListener("click", function () {
        if (!state.packaging) {
            alert("Please select Bottle or Blister.");
            return;
        }
        if (state.packaging === "Blister" && (!state.material || !state.rows)) {
            alert("Please select blister Material and Rows.");
            return;
        }
        state.finishTime = localTimeString();
        var record = {
            operator: state.operator,
            drugName: state.drugName,
            strength: state.strength,
            barcode: state.barcode,
            packaging: state.packaging,
            material: state.packaging === "Blister" ? state.material : "",
            rows: state.packaging === "Blister" ? state.rows : "",
            captureDate: state.captureDate,
            finishTime: state.finishTime
        };
        var records = getRecords();
        records.push(record);
        saveRecords(records);
        renderRecords();
        $("savedSummary").innerHTML = summaryHtml(true) +
            "<div class=\"summary-item\"><div class=\"summary-label\">Operator</div><div class=\"summary-value\">".concat(escapeHtml(state.operator), "</div></div>") +
            "<div class=\"summary-item\"><div class=\"summary-label\">Capture Date</div><div class=\"summary-value\">".concat(escapeHtml(state.captureDate), "</div></div>") +
            "<div class=\"summary-item\"><div class=\"summary-label\">Finish Time</div><div class=\"summary-value\">".concat(escapeHtml(state.finishTime), "</div></div>");
        hide("packagingCard");
        show("savedCard");
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
    $("newEntryBtn").addEventListener("click", function () {
        var currentOperator = state.operator;
        resetEntry(true);
        $("operator").value = currentOperator;
        state.operator = currentOperator;
        state.captureDate = localDateString();
        hide("savedCard");
        show("identifyCard");
    });
    $("exportCsvBtn").addEventListener("click", function () {
        var records = getRecords();
        if (!records.length) {
            alert("There are no stored measurements to export.");
            return;
        }
        var headers = ["Operator", "Drug Name", "Strength", "EAN-13 Barcode", "Packaging", "Material", "Rows", "Capture Date", "Finish Time"];
        var keys = ["operator", "drugName", "strength", "barcode", "packaging", "material", "rows", "captureDate", "finishTime"];
        var q = function (v) { return "\"".concat(String(v == null ? "" : v).replace(/"/g, '""'), "\""); };
        var csv = [headers.map(q).join(",")]
            .concat(records.map(function (r) { return keys.map(function (k) { return q(r[k]); }).join(","); }))
            .join("\r\n");
        var blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
        var url = URL.createObjectURL(blob);
        var a = document.createElement("a");
        a.href = url;
        a.download = "Webstercare_Medication_Measurements_".concat(new Date().toISOString().slice(0, 10), ".csv");
        a.click();
        URL.revokeObjectURL(url);
    });
    $("clearDataBtn").addEventListener("click", function () {
        if (confirm("Clear all stored measurement records from this device?")) {
            localStorage.removeItem("webstercareMedicationMeasurements");
            renderRecords();
        }
    });
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("./service-worker.js").catch(function () { });
    }
    renderRecords();
})();
