var MINIZINC = (() => {
    var _scriptDir =
        typeof document !== 'undefined' && document.currentScript
            ? document.currentScript.src
            : undefined;
    if (typeof __filename !== 'undefined')
        _scriptDir = _scriptDir || __filename;
    return function (MINIZINC) {
        MINIZINC = MINIZINC || {};

        var Module = typeof MINIZINC != 'undefined' ? MINIZINC : {};
        var readyPromiseResolve, readyPromiseReject;
        Module['ready'] = new Promise(function (resolve, reject) {
            readyPromiseResolve = resolve;
            readyPromiseReject = reject;
        });
        if (!Module.expectedDataFileDownloads) {
            Module.expectedDataFileDownloads = 0;
        }
        Module.expectedDataFileDownloads++;
        (function () {
            if (Module['ENVIRONMENT_IS_PTHREAD']) return;
            var loadPackage = function (metadata) {
                var PACKAGE_PATH = '';
                if (typeof window === 'object') {
                    PACKAGE_PATH = window['encodeURIComponent'](
                        window.location.pathname
                            .toString()
                            .substring(
                                0,
                                window.location.pathname
                                    .toString()
                                    .lastIndexOf('/')
                            ) + '/'
                    );
                } else if (
                    typeof process === 'undefined' &&
                    typeof location !== 'undefined'
                ) {
                    PACKAGE_PATH = encodeURIComponent(
                        location.pathname
                            .toString()
                            .substring(
                                0,
                                location.pathname.toString().lastIndexOf('/')
                            ) + '/'
                    );
                }
                var PACKAGE_NAME = 'minizinc.data';
                var REMOTE_PACKAGE_BASE = 'minizinc.data';
                if (
                    typeof Module['locateFilePackage'] === 'function' &&
                    !Module['locateFile']
                ) {
                    Module['locateFile'] = Module['locateFilePackage'];
                    err(
                        'warning: you defined Module.locateFilePackage, that has been renamed to Module.locateFile (using your locateFilePackage for now)'
                    );
                }
                var REMOTE_PACKAGE_NAME = Module['locateFile']
                    ? Module['locateFile'](REMOTE_PACKAGE_BASE, '')
                    : REMOTE_PACKAGE_BASE;
                var REMOTE_PACKAGE_SIZE = metadata['remote_package_size'];
                function fetchRemotePackage(
                    packageName,
                    packageSize,
                    callback,
                    errback
                ) {
                    if (
                        typeof process === 'object' &&
                        typeof process.versions === 'object' &&
                        typeof process.versions.node === 'string'
                    ) {
                        require('fs').readFile(
                            packageName,
                            function (err, contents) {
                                if (err) {
                                    errback(err);
                                } else {
                                    callback(contents.buffer);
                                }
                            }
                        );
                        return;
                    }
                    var xhr = new XMLHttpRequest();
                    xhr.open('GET', packageName, true);
                    xhr.responseType = 'arraybuffer';
                    xhr.onprogress = function (event) {
                        var url = packageName;
                        var size = packageSize;
                        if (event.total) size = event.total;
                        if (event.loaded) {
                            if (!xhr.addedTotal) {
                                xhr.addedTotal = true;
                                if (!Module.dataFileDownloads)
                                    Module.dataFileDownloads = {};
                                Module.dataFileDownloads[url] = {
                                    loaded: event.loaded,
                                    total: size,
                                };
                            } else {
                                Module.dataFileDownloads[url].loaded =
                                    event.loaded;
                            }
                            var total = 0;
                            var loaded = 0;
                            var num = 0;
                            for (var download in Module.dataFileDownloads) {
                                var data = Module.dataFileDownloads[download];
                                total += data.total;
                                loaded += data.loaded;
                                num++;
                            }
                            total = Math.ceil(
                                (total * Module.expectedDataFileDownloads) / num
                            );
                            if (Module['setStatus'])
                                Module['setStatus'](
                                    'Downloading data... (' +
                                        loaded +
                                        '/' +
                                        total +
                                        ')'
                                );
                        } else if (!Module.dataFileDownloads) {
                            if (Module['setStatus'])
                                Module['setStatus']('Downloading data...');
                        }
                    };
                    xhr.onerror = function (event) {
                        throw new Error('NetworkError for: ' + packageName);
                    };
                    xhr.onload = function (event) {
                        if (
                            xhr.status == 200 ||
                            xhr.status == 304 ||
                            xhr.status == 206 ||
                            (xhr.status == 0 && xhr.response)
                        ) {
                            var packageData = xhr.response;
                            callback(packageData);
                        } else {
                            throw new Error(
                                xhr.statusText + ' : ' + xhr.responseURL
                            );
                        }
                    };
                    xhr.send(null);
                }
                function handleError(error) {
                    console.error('package error:', error);
                }
                var fetchedCallback = null;
                var fetched = Module['getPreloadedPackage']
                    ? Module['getPreloadedPackage'](
                          REMOTE_PACKAGE_NAME,
                          REMOTE_PACKAGE_SIZE
                      )
                    : null;
                if (!fetched)
                    fetchRemotePackage(
                        REMOTE_PACKAGE_NAME,
                        REMOTE_PACKAGE_SIZE,
                        function (data) {
                            if (fetchedCallback) {
                                fetchedCallback(data);
                                fetchedCallback = null;
                            } else {
                                fetched = data;
                            }
                        },
                        handleError
                    );
                function runWithFS() {
                    function assert(check, msg) {
                        if (!check) throw msg + new Error().stack;
                    }
                    Module['FS_createPath']('/', 'usr', true, true);
                    Module['FS_createPath']('/usr', 'share', true, true);
                    Module['FS_createPath'](
                        '/usr/share',
                        'minizinc',
                        true,
                        true
                    );
                    Module['FS_createPath'](
                        '/usr/share/minizinc',
                        'geas',
                        true,
                        true
                    );
                    Module['FS_createPath'](
                        '/usr/share/minizinc',
                        'gecode_presolver',
                        true,
                        true
                    );
                    Module['FS_createPath'](
                        '/usr/share/minizinc',
                        'linear',
                        true,
                        true
                    );
                    Module['FS_createPath'](
                        '/usr/share/minizinc',
                        'std',
                        true,
                        true
                    );
                    Module['FS_createPath'](
                        '/usr/share/minizinc/std',
                        'ide',
                        true,
                        true
                    );
                    Module['FS_createPath'](
                        '/usr/share/minizinc/std',
                        'output',
                        true,
                        true
                    );
                    Module['FS_createPath'](
                        '/usr/share/minizinc/std',
                        'stdlib',
                        true,
                        true
                    );
                    function processPackageData(arrayBuffer) {
                        assert(arrayBuffer, 'Loading data file failed.');
                        assert(
                            arrayBuffer.constructor.name === ArrayBuffer.name,
                            'bad input to processPackageData'
                        );
                        var byteArray = new Uint8Array(arrayBuffer);
                        var compressedData = {
                            data: null,
                            cachedOffset: 407542,
                            cachedIndexes: [-1, -1],
                            cachedChunks: [null, null],
                            offsets: [
                                0, 711, 1758, 2475, 3598, 5101, 6353, 7708,
                                9031, 10294, 11606, 13045, 14523, 15960, 17248,
                                18600, 20054, 21314, 22723, 23958, 25403, 26757,
                                28162, 29458, 30752, 32071, 33396, 34866, 36218,
                                37699, 38988, 40329, 41709, 43098, 44348, 45657,
                                46972, 48227, 49542, 51098, 52676, 54219, 55668,
                                56933, 58215, 59636, 60976, 61675, 62419, 63586,
                                64843, 66266, 67150, 68147, 69098, 70209, 71511,
                                72473, 73490, 74299, 75107, 75783, 76557, 77567,
                                78752, 79730, 80978, 82208, 83547, 84223, 85391,
                                86333, 87425, 88589, 89823, 90985, 91929, 93049,
                                94146, 95283, 96606, 97689, 98751, 99894,
                                101093, 102291, 103298, 104305, 105204, 106179,
                                107060, 108041, 109196, 110034, 111140, 112086,
                                112711, 113738, 114533, 115040, 116041, 117183,
                                118295, 119184, 120096, 120801, 121585, 122591,
                                123860, 124528, 125270, 125978, 126953, 127652,
                                128434, 129133, 129772, 130472, 131222, 131913,
                                132592, 133453, 134092, 134859, 135703, 136769,
                                137528, 138373, 139158, 139851, 141006, 142082,
                                143252, 143912, 144388, 145477, 146555, 147013,
                                147912, 148769, 149557, 150499, 151088, 151753,
                                152796, 153434, 154230, 154915, 155376, 155937,
                                156508, 156928, 157552, 158478, 159279, 160099,
                                160883, 161405, 161999, 162923, 164082, 165216,
                                166102, 166951, 167434, 168095, 168636, 169060,
                                169957, 170962, 171964, 172970, 173662, 174346,
                                174867, 175635, 176496, 177265, 178057, 178989,
                                179528, 179919, 180481, 181113, 181861, 182421,
                                183344, 184087, 184965, 185799, 186778, 187735,
                                188315, 189171, 189924, 190799, 191484, 192181,
                                192850, 193561, 194334, 194762, 195136, 195783,
                                196104, 196792, 197440, 198132, 198523, 199369,
                                199927, 200587, 201154, 201834, 202502, 203248,
                                203896, 204813, 205828, 206782, 207760, 208503,
                                208937, 209500, 210396, 211127, 211900, 212986,
                                213998, 214804, 215434, 216213, 217089, 218032,
                                219137, 220225, 221051, 221418, 222174, 223045,
                                223758, 224510, 225484, 226436, 227367, 228368,
                                229235, 229911, 230704, 231729, 232719, 233786,
                                234821, 235606, 236338, 237289, 238096, 238938,
                                239942, 240763, 241942, 242825, 243810, 244575,
                                245164, 245910, 246434, 247222, 247872, 248542,
                                249155, 249903, 250832, 251530, 252220, 252802,
                                253449, 254379, 255597, 256450, 257376, 258420,
                                259399, 260302, 261194, 262138, 263162, 264015,
                                264827, 265866, 266751, 267785, 268255, 269090,
                                269836, 270385, 271042, 271903, 272989, 273455,
                                274253, 274802, 275725, 276187, 276842, 277553,
                                278093, 278636, 279276, 279937, 280451, 281021,
                                282224, 283337, 284481, 285419, 285912, 286931,
                                287981, 288763, 289805, 290403, 291017, 291516,
                                292076, 292828, 293511, 294778, 295987, 296950,
                                297761, 298809, 299724, 300554, 301340, 302249,
                                303122, 304196, 304973, 305973, 306946, 308383,
                                309428, 310231, 311429, 312515, 313260, 313986,
                                315133, 315887, 316483, 317117, 317865, 318622,
                                319419, 320405, 321131, 322244, 323036, 323431,
                                323964, 324583, 325057, 325853, 326606, 327391,
                                328360, 329203, 329681, 330290, 330915, 331426,
                                331914, 332552, 333382, 334171, 334563, 334970,
                                335471, 335888, 336722, 337500, 338136, 338712,
                                339258, 340126, 340914, 341989, 343142, 343931,
                                344632, 345351, 346033, 346740, 347522, 348188,
                                348866, 349519, 350237, 350924, 351662, 352317,
                                353061, 353794, 354559, 355374, 356058, 356915,
                                357641, 358395, 359157, 359984, 360953, 361778,
                                362499, 363731, 364216, 364705, 365459, 366542,
                                367494, 368022, 368588, 369237, 369894, 370414,
                                370947, 371587, 372294, 372990, 373742, 374487,
                                375066, 375752, 376446, 377193, 377950, 378838,
                                379584, 380151, 380598, 381421, 382106, 382892,
                                383741, 384710, 385603, 386137, 386835, 387309,
                                387922, 388722, 389379, 389912, 390526, 391394,
                                392258, 393144, 394290, 395449, 396276, 397232,
                                398064, 398711, 399442, 400283, 401336, 402137,
                                402959, 403788, 404463, 405139, 405986, 406805,
                            ],
                            sizes: [
                                711, 1047, 717, 1123, 1503, 1252, 1355, 1323,
                                1263, 1312, 1439, 1478, 1437, 1288, 1352, 1454,
                                1260, 1409, 1235, 1445, 1354, 1405, 1296, 1294,
                                1319, 1325, 1470, 1352, 1481, 1289, 1341, 1380,
                                1389, 1250, 1309, 1315, 1255, 1315, 1556, 1578,
                                1543, 1449, 1265, 1282, 1421, 1340, 699, 744,
                                1167, 1257, 1423, 884, 997, 951, 1111, 1302,
                                962, 1017, 809, 808, 676, 774, 1010, 1185, 978,
                                1248, 1230, 1339, 676, 1168, 942, 1092, 1164,
                                1234, 1162, 944, 1120, 1097, 1137, 1323, 1083,
                                1062, 1143, 1199, 1198, 1007, 1007, 899, 975,
                                881, 981, 1155, 838, 1106, 946, 625, 1027, 795,
                                507, 1001, 1142, 1112, 889, 912, 705, 784, 1006,
                                1269, 668, 742, 708, 975, 699, 782, 699, 639,
                                700, 750, 691, 679, 861, 639, 767, 844, 1066,
                                759, 845, 785, 693, 1155, 1076, 1170, 660, 476,
                                1089, 1078, 458, 899, 857, 788, 942, 589, 665,
                                1043, 638, 796, 685, 461, 561, 571, 420, 624,
                                926, 801, 820, 784, 522, 594, 924, 1159, 1134,
                                886, 849, 483, 661, 541, 424, 897, 1005, 1002,
                                1006, 692, 684, 521, 768, 861, 769, 792, 932,
                                539, 391, 562, 632, 748, 560, 923, 743, 878,
                                834, 979, 957, 580, 856, 753, 875, 685, 697,
                                669, 711, 773, 428, 374, 647, 321, 688, 648,
                                692, 391, 846, 558, 660, 567, 680, 668, 746,
                                648, 917, 1015, 954, 978, 743, 434, 563, 896,
                                731, 773, 1086, 1012, 806, 630, 779, 876, 943,
                                1105, 1088, 826, 367, 756, 871, 713, 752, 974,
                                952, 931, 1001, 867, 676, 793, 1025, 990, 1067,
                                1035, 785, 732, 951, 807, 842, 1004, 821, 1179,
                                883, 985, 765, 589, 746, 524, 788, 650, 670,
                                613, 748, 929, 698, 690, 582, 647, 930, 1218,
                                853, 926, 1044, 979, 903, 892, 944, 1024, 853,
                                812, 1039, 885, 1034, 470, 835, 746, 549, 657,
                                861, 1086, 466, 798, 549, 923, 462, 655, 711,
                                540, 543, 640, 661, 514, 570, 1203, 1113, 1144,
                                938, 493, 1019, 1050, 782, 1042, 598, 614, 499,
                                560, 752, 683, 1267, 1209, 963, 811, 1048, 915,
                                830, 786, 909, 873, 1074, 777, 1e3, 973, 1437,
                                1045, 803, 1198, 1086, 745, 726, 1147, 754, 596,
                                634, 748, 757, 797, 986, 726, 1113, 792, 395,
                                533, 619, 474, 796, 753, 785, 969, 843, 478,
                                609, 625, 511, 488, 638, 830, 789, 392, 407,
                                501, 417, 834, 778, 636, 576, 546, 868, 788,
                                1075, 1153, 789, 701, 719, 682, 707, 782, 666,
                                678, 653, 718, 687, 738, 655, 744, 733, 765,
                                815, 684, 857, 726, 754, 762, 827, 969, 825,
                                721, 1232, 485, 489, 754, 1083, 952, 528, 566,
                                649, 657, 520, 533, 640, 707, 696, 752, 745,
                                579, 686, 694, 747, 757, 888, 746, 567, 447,
                                823, 685, 786, 849, 969, 893, 534, 698, 474,
                                613, 800, 657, 533, 614, 868, 864, 886, 1146,
                                1159, 827, 956, 832, 647, 731, 841, 1053, 801,
                                822, 829, 675, 676, 847, 819, 737,
                            ],
                            successes: [
                                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                                1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                            ],
                        };
                        compressedData['data'] = byteArray;
                        assert(
                            typeof Module['LZ4'] === 'object',
                            'LZ4 not present - was your app build with -sLZ4?'
                        );
                        Module['LZ4'].loadPackage(
                            {
                                metadata: metadata,
                                compressedData: compressedData,
                            },
                            false
                        );
                        Module['removeRunDependency']('datafile_minizinc.data');
                    }
                    Module['addRunDependency']('datafile_minizinc.data');
                    if (!Module.preloadResults) Module.preloadResults = {};
                    Module.preloadResults[PACKAGE_NAME] = { fromCache: false };
                    if (fetched) {
                        processPackageData(fetched);
                        fetched = null;
                    } else {
                        fetchedCallback = processPackageData;
                    }
                }
                if (Module['calledRun']) {
                    runWithFS();
                } else {
                    if (!Module['preRun']) Module['preRun'] = [];
                    Module['preRun'].push(runWithFS);
                }
            };
            loadPackage({
                files: [
                    {
                        filename: '/usr/share/minizinc/Preferences.json',
                        start: 0,
                        end: 556,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/geas/fzn_all_different_int.mzn',
                        start: 556,
                        end: 705,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/geas/fzn_alldifferent_except_0.mzn',
                        start: 705,
                        end: 868,
                    },
                    {
                        filename: '/usr/share/minizinc/geas/fzn_cumulative.mzn',
                        start: 868,
                        end: 1491,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/geas/fzn_disjunctive.mzn',
                        start: 1491,
                        end: 1868,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/geas/fzn_global_cardinality.mzn',
                        start: 1868,
                        end: 2564,
                    },
                    {
                        filename: '/usr/share/minizinc/geas/fzn_inverse.mzn',
                        start: 2564,
                        end: 2785,
                    },
                    {
                        filename: '/usr/share/minizinc/geas/fzn_table_int.mzn',
                        start: 2785,
                        end: 3186,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/geas/fzn_value_precede_int.mzn',
                        start: 3186,
                        end: 3484,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/geas/redefinitions-2.0.mzn',
                        start: 3484,
                        end: 4558,
                    },
                    {
                        filename: '/usr/share/minizinc/geas/redefinitions.mzn',
                        start: 4558,
                        end: 7880,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/gecode_presolver/fzn_all_different_int.mzn',
                        start: 7880,
                        end: 9824,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/gecode_presolver/fzn_all_equal_int.mzn',
                        start: 9824,
                        end: 11289,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/gecode_presolver/fzn_among.mzn',
                        start: 11289,
                        end: 12773,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/gecode_presolver/fzn_arg_max_int.mzn',
                        start: 12773,
                        end: 12975,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/gecode_presolver/fzn_arg_min_int.mzn',
                        start: 12975,
                        end: 13177,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/gecode_presolver/fzn_at_least_int.mzn',
                        start: 13177,
                        end: 14659,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/gecode_presolver/fzn_at_least_set.mzn',
                        start: 14659,
                        end: 16209,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/gecode_presolver/fzn_at_most_int.mzn',
                        start: 16209,
                        end: 17690,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/gecode_presolver/fzn_at_most_set.mzn',
                        start: 17690,
                        end: 19239,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/gecode_presolver/fzn_bin_packing.mzn',
                        start: 19239,
                        end: 20982,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/gecode_presolver/fzn_bin_packing_capa.mzn',
                        start: 20982,
                        end: 22776,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/gecode_presolver/fzn_bin_packing_load.mzn',
                        start: 22776,
                        end: 24634,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/gecode_presolver/fzn_circuit.mzn',
                        start: 24634,
                        end: 26316,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/gecode_presolver/fzn_count_eq.mzn',
                        start: 26316,
                        end: 27901,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/gecode_presolver/fzn_count_eq_reif.mzn',
                        start: 27901,
                        end: 29586,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/gecode_presolver/fzn_cumulative.mzn',
                        start: 29586,
                        end: 31801,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/gecode_presolver/fzn_decreasing_bool.mzn',
                        start: 31801,
                        end: 33269,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/gecode_presolver/fzn_decreasing_int.mzn',
                        start: 33269,
                        end: 34735,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/gecode_presolver/fzn_diffn.mzn',
                        start: 34735,
                        end: 36503,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/gecode_presolver/fzn_disjoint.mzn',
                        start: 36503,
                        end: 37979,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/gecode_presolver/fzn_distribute.mzn',
                        start: 37979,
                        end: 39838,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/gecode_presolver/fzn_exactly_int.mzn',
                        start: 39838,
                        end: 41362,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/gecode_presolver/fzn_exactly_set.mzn',
                        start: 41362,
                        end: 42911,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/gecode_presolver/fzn_global_cardinality.mzn',
                        start: 42911,
                        end: 44677,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/gecode_presolver/fzn_global_cardinality_closed.mzn',
                        start: 44677,
                        end: 46291,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/gecode_presolver/fzn_global_cardinality_low_up.mzn',
                        start: 46291,
                        end: 47971,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/gecode_presolver/fzn_global_cardinality_low_up_closed.mzn',
                        start: 47971,
                        end: 49676,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/gecode_presolver/fzn_increasing_bool.mzn',
                        start: 49676,
                        end: 51146,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/gecode_presolver/fzn_increasing_int.mzn',
                        start: 51146,
                        end: 52614,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/gecode_presolver/fzn_int_set_channel.mzn',
                        start: 52614,
                        end: 54655,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/gecode_presolver/fzn_inverse.mzn',
                        start: 54655,
                        end: 56383,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/gecode_presolver/fzn_inverse_set.mzn',
                        start: 56383,
                        end: 58470,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/gecode_presolver/fzn_lex_less_bool.mzn',
                        start: 58470,
                        end: 60130,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/gecode_presolver/fzn_lex_less_int.mzn',
                        start: 60130,
                        end: 61794,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/gecode_presolver/fzn_lex_lesseq_bool.mzn',
                        start: 61794,
                        end: 63469,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/gecode_presolver/fzn_lex_lesseq_int.mzn',
                        start: 63469,
                        end: 65137,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/gecode_presolver/fzn_link_set_to_booleans.mzn',
                        start: 65137,
                        end: 66878,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/gecode_presolver/fzn_member_bool.mzn',
                        start: 66878,
                        end: 68355,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/gecode_presolver/fzn_member_bool_reif.mzn',
                        start: 68355,
                        end: 70032,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/gecode_presolver/fzn_member_int.mzn',
                        start: 70032,
                        end: 71506,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/gecode_presolver/fzn_member_int_reif.mzn',
                        start: 71506,
                        end: 73178,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/gecode_presolver/fzn_nvalue.mzn',
                        start: 73178,
                        end: 74648,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/gecode_presolver/fzn_partition_set.mzn',
                        start: 74648,
                        end: 76349,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/gecode_presolver/fzn_range.mzn',
                        start: 76349,
                        end: 78426,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/gecode_presolver/fzn_regular.mzn',
                        start: 78426,
                        end: 79971,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/gecode_presolver/fzn_roots.mzn',
                        start: 79971,
                        end: 82433,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/gecode_presolver/fzn_sort.mzn',
                        start: 82433,
                        end: 83917,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/gecode_presolver/fzn_sum_pred.mzn',
                        start: 83917,
                        end: 85623,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/gecode_presolver/fzn_table_bool.mzn',
                        start: 85623,
                        end: 87116,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/gecode_presolver/fzn_table_int.mzn',
                        start: 87116,
                        end: 88712,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/gecode_presolver/fzn_value_precede_int.mzn',
                        start: 88712,
                        end: 90295,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/gecode_presolver/fzn_value_precede_set.mzn',
                        start: 90295,
                        end: 91900,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/gecode_presolver/gecode.mzn',
                        start: 91900,
                        end: 99662,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/gecode_presolver/precedence.mzn',
                        start: 99662,
                        end: 101296,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/gecode_presolver/redefinitions-2.0.mzn',
                        start: 101296,
                        end: 102506,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/gecode_presolver/redefinitions.mzn',
                        start: 102506,
                        end: 105616,
                    },
                    {
                        filename: '/usr/share/minizinc/linear/CHANGELOG.txt',
                        start: 105616,
                        end: 105897,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/linear/domain_encodings.mzn',
                        start: 105897,
                        end: 110215,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/linear/fzn_all_different_int.mzn',
                        start: 110215,
                        end: 111068,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/linear/fzn_alldifferent_except_0.mzn',
                        start: 111068,
                        end: 111725,
                    },
                    {
                        filename: '/usr/share/minizinc/linear/fzn_circuit.mzn',
                        start: 111725,
                        end: 113440,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/linear/fzn_cumulative.mzn',
                        start: 113440,
                        end: 117429,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/linear/fzn_if_then_else_float.mzn',
                        start: 117429,
                        end: 117714,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/linear/fzn_if_then_else_int.mzn',
                        start: 117714,
                        end: 117993,
                    },
                    {
                        filename: '/usr/share/minizinc/linear/fzn_inverse.mzn',
                        start: 117993,
                        end: 118625,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/linear/fzn_inverse_in_range.mzn',
                        start: 118625,
                        end: 118829,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/linear/fzn_inverse_in_range_reif.mzn',
                        start: 118829,
                        end: 119093,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/linear/fzn_inverse_reif.mzn',
                        start: 119093,
                        end: 119418,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/linear/fzn_lex_chain_lesseq_bool.mzn',
                        start: 119418,
                        end: 119562,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/linear/fzn_lex_chain_lesseq_int.mzn',
                        start: 119562,
                        end: 120251,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/linear/fzn_lex_chain_lesseq_orbitope.mzn',
                        start: 120251,
                        end: 121434,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/linear/fzn_lex_less_bool.mzn',
                        start: 121434,
                        end: 121997,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/linear/fzn_lex_less_float.mzn',
                        start: 121997,
                        end: 123409,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/linear/fzn_lex_less_int.mzn',
                        start: 123409,
                        end: 124801,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/linear/fzn_lex_lesseq_bool.mzn',
                        start: 124801,
                        end: 125375,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/linear/fzn_lex_lesseq_float.mzn',
                        start: 125375,
                        end: 126839,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/linear/fzn_lex_lesseq_int.mzn',
                        start: 126839,
                        end: 129701,
                    },
                    {
                        filename: '/usr/share/minizinc/linear/fzn_regular.mzn',
                        start: 129701,
                        end: 134288,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/linear/fzn_sliding_sum.mzn',
                        start: 134288,
                        end: 134680,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/linear/fzn_subcircuit.mzn',
                        start: 134680,
                        end: 136668,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/linear/fzn_table_int.mzn',
                        start: 136668,
                        end: 137411,
                    },
                    {
                        filename: '/usr/share/minizinc/linear/options.mzn',
                        start: 137411,
                        end: 147853,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/linear/redefinitions-2.0.2.mzn',
                        start: 147853,
                        end: 149059,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/linear/redefinitions-2.0.mzn',
                        start: 149059,
                        end: 149831,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/linear/redefinitions-2.2.1.mzn',
                        start: 149831,
                        end: 150087,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/linear/redefinitions.mzn',
                        start: 150087,
                        end: 179206,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/linear/redefs_bool_imp.mzn',
                        start: 179206,
                        end: 181991,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/linear/redefs_bool_reifs.mzn',
                        start: 181991,
                        end: 187893,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/linear/redefs_lin_halfreifs.mzn',
                        start: 187893,
                        end: 196567,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/linear/redefs_lin_imp.mzn',
                        start: 196567,
                        end: 202759,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/linear/redefs_lin_reifs.mzn',
                        start: 202759,
                        end: 218468,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/linear/subcircuit_wDummy.mzn',
                        start: 218468,
                        end: 221293,
                    },
                    {
                        filename: '/usr/share/minizinc/std/all_different.mzn',
                        start: 221293,
                        end: 222563,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/all_different_except.mzn',
                        start: 222563,
                        end: 223066,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/all_different_except_0.mzn',
                        start: 223066,
                        end: 223549,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/all_different_int.mzn',
                        start: 223549,
                        end: 223935,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/all_different_int.mzn.deprecated.mzn',
                        start: 223935,
                        end: 224084,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/all_different_set.mzn',
                        start: 224084,
                        end: 224477,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/all_different_set.mzn.deprecated.mzn',
                        start: 224477,
                        end: 224633,
                    },
                    {
                        filename: '/usr/share/minizinc/std/all_disjoint.mzn',
                        start: 224633,
                        end: 224907,
                    },
                    {
                        filename: '/usr/share/minizinc/std/all_equal.mzn',
                        start: 224907,
                        end: 225488,
                    },
                    {
                        filename: '/usr/share/minizinc/std/all_equal_int.mzn',
                        start: 225488,
                        end: 225905,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/all_equal_int.mzn.deprecated.mzn',
                        start: 225905,
                        end: 226049,
                    },
                    {
                        filename: '/usr/share/minizinc/std/all_equal_set.mzn',
                        start: 226049,
                        end: 226472,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/all_equal_set.mzn.deprecated.mzn',
                        start: 226472,
                        end: 226623,
                    },
                    {
                        filename: '/usr/share/minizinc/std/alldifferent.mzn',
                        start: 226623,
                        end: 226786,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/alldifferent_except.mzn',
                        start: 226786,
                        end: 226963,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/alldifferent_except_0.mzn',
                        start: 226963,
                        end: 227144,
                    },
                    {
                        filename: '/usr/share/minizinc/std/alternative.mzn',
                        start: 227144,
                        end: 227805,
                    },
                    {
                        filename: '/usr/share/minizinc/std/among.mzn',
                        start: 227805,
                        end: 228098,
                    },
                    {
                        filename: '/usr/share/minizinc/std/among_fn.mzn',
                        start: 228098,
                        end: 228434,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/analyse_all_different.mzn',
                        start: 228434,
                        end: 228504,
                    },
                    {
                        filename: '/usr/share/minizinc/std/arg_max.mzn',
                        start: 228504,
                        end: 235695,
                    },
                    {
                        filename: '/usr/share/minizinc/std/arg_max_bool.mzn',
                        start: 235695,
                        end: 235825,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/arg_max_bool.mzn.deprecated.mzn',
                        start: 235825,
                        end: 235986,
                    },
                    {
                        filename: '/usr/share/minizinc/std/arg_max_float.mzn',
                        start: 235986,
                        end: 236120,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/arg_max_float.mzn.deprecated.mzn',
                        start: 236120,
                        end: 236283,
                    },
                    {
                        filename: '/usr/share/minizinc/std/arg_max_int.mzn',
                        start: 236283,
                        end: 236409,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/arg_max_int.mzn.deprecated.mzn',
                        start: 236409,
                        end: 236568,
                    },
                    {
                        filename: '/usr/share/minizinc/std/arg_min.mzn',
                        start: 236568,
                        end: 243773,
                    },
                    {
                        filename: '/usr/share/minizinc/std/arg_min_bool.mzn',
                        start: 243773,
                        end: 243903,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/arg_min_bool.mzn.deprecated.mzn',
                        start: 243903,
                        end: 244064,
                    },
                    {
                        filename: '/usr/share/minizinc/std/arg_min_float.mzn',
                        start: 244064,
                        end: 244198,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/arg_min_float.mzn.deprecated.mzn',
                        start: 244198,
                        end: 244361,
                    },
                    {
                        filename: '/usr/share/minizinc/std/arg_min_int.mzn',
                        start: 244361,
                        end: 244487,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/arg_min_int.mzn.deprecated.mzn',
                        start: 244487,
                        end: 244646,
                    },
                    {
                        filename: '/usr/share/minizinc/std/arg_sort.mzn',
                        start: 244646,
                        end: 246582,
                    },
                    {
                        filename: '/usr/share/minizinc/std/arg_sort_float.mzn',
                        start: 246582,
                        end: 246917,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/arg_sort_float.mzn.deprecated.mzn',
                        start: 246917,
                        end: 247114,
                    },
                    {
                        filename: '/usr/share/minizinc/std/arg_sort_int.mzn',
                        start: 247114,
                        end: 247537,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/arg_sort_int.mzn.deprecated.mzn',
                        start: 247537,
                        end: 247900,
                    },
                    {
                        filename: '/usr/share/minizinc/std/at_least.mzn',
                        start: 247900,
                        end: 248730,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/at_least.mzn.deprecated.mzn',
                        start: 248730,
                        end: 248885,
                    },
                    {
                        filename: '/usr/share/minizinc/std/at_least_int.mzn',
                        start: 248885,
                        end: 249283,
                    },
                    {
                        filename: '/usr/share/minizinc/std/at_least_set.mzn',
                        start: 249283,
                        end: 249695,
                    },
                    {
                        filename: '/usr/share/minizinc/std/at_most.mzn',
                        start: 249695,
                        end: 250515,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/at_most.mzn.deprecated.mzn',
                        start: 250515,
                        end: 250669,
                    },
                    {
                        filename: '/usr/share/minizinc/std/at_most1.mzn',
                        start: 250669,
                        end: 251011,
                    },
                    {
                        filename: '/usr/share/minizinc/std/at_most_int.mzn',
                        start: 251011,
                        end: 251404,
                    },
                    {
                        filename: '/usr/share/minizinc/std/at_most_set.mzn',
                        start: 251404,
                        end: 251811,
                    },
                    {
                        filename: '/usr/share/minizinc/std/atleast.mzn',
                        start: 251811,
                        end: 251959,
                    },
                    {
                        filename: '/usr/share/minizinc/std/atmost.mzn',
                        start: 251959,
                        end: 252103,
                    },
                    {
                        filename: '/usr/share/minizinc/std/atmost1.mzn',
                        start: 252103,
                        end: 252251,
                    },
                    {
                        filename: '/usr/share/minizinc/std/bin_packing.mzn',
                        start: 252251,
                        end: 253118,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/bin_packing_capa.mzn',
                        start: 253118,
                        end: 254100,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/bin_packing_load.mzn',
                        start: 254100,
                        end: 254903,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/bin_packing_load_fn.mzn',
                        start: 254903,
                        end: 255681,
                    },
                    {
                        filename: '/usr/share/minizinc/std/bounded_path.mzn',
                        start: 255681,
                        end: 261546,
                    },
                    {
                        filename: '/usr/share/minizinc/std/circuit.mzn',
                        start: 261546,
                        end: 261904,
                    },
                    {
                        filename: '/usr/share/minizinc/std/circuit_opt.mzn',
                        start: 261904,
                        end: 262246,
                    },
                    {
                        filename: '/usr/share/minizinc/std/connected.mzn',
                        start: 262246,
                        end: 264346,
                    },
                    {
                        filename: '/usr/share/minizinc/std/cost_mdd.mzn',
                        start: 264346,
                        end: 268130,
                    },
                    {
                        filename: '/usr/share/minizinc/std/cost_regular.mzn',
                        start: 268130,
                        end: 269854,
                    },
                    {
                        filename: '/usr/share/minizinc/std/count.mzn',
                        start: 269854,
                        end: 270076,
                    },
                    {
                        filename: '/usr/share/minizinc/std/count_eq.mzn',
                        start: 270076,
                        end: 271149,
                    },
                    {
                        filename: '/usr/share/minizinc/std/count_fn.mzn',
                        start: 271149,
                        end: 271519,
                    },
                    {
                        filename: '/usr/share/minizinc/std/count_geq.mzn',
                        start: 271519,
                        end: 272196,
                    },
                    {
                        filename: '/usr/share/minizinc/std/count_gt.mzn',
                        start: 272196,
                        end: 272859,
                    },
                    {
                        filename: '/usr/share/minizinc/std/count_leq.mzn',
                        start: 272859,
                        end: 273530,
                    },
                    {
                        filename: '/usr/share/minizinc/std/count_lt.mzn',
                        start: 273530,
                        end: 274187,
                    },
                    {
                        filename: '/usr/share/minizinc/std/count_neq.mzn',
                        start: 274187,
                        end: 274840,
                    },
                    {
                        filename: '/usr/share/minizinc/std/cumulative.mzn',
                        start: 274840,
                        end: 276223,
                    },
                    {
                        filename: '/usr/share/minizinc/std/cumulative_opt.mzn',
                        start: 276223,
                        end: 277207,
                    },
                    {
                        filename: '/usr/share/minizinc/std/dag.mzn',
                        start: 277207,
                        end: 278180,
                    },
                    {
                        filename: '/usr/share/minizinc/std/decreasing.mzn',
                        start: 278180,
                        end: 279241,
                    },
                    {
                        filename: '/usr/share/minizinc/std/decreasing_bool.mzn',
                        start: 279241,
                        end: 279645,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/decreasing_bool.mzn.deprecated.mzn',
                        start: 279645,
                        end: 279792,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/decreasing_float.mzn',
                        start: 279792,
                        end: 280201,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/decreasing_float.mzn.deprecated.mzn',
                        start: 280201,
                        end: 280350,
                    },
                    {
                        filename: '/usr/share/minizinc/std/decreasing_int.mzn',
                        start: 280350,
                        end: 280751,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/decreasing_int.mzn.deprecated.mzn',
                        start: 280751,
                        end: 280896,
                    },
                    {
                        filename: '/usr/share/minizinc/std/decreasing_set.mzn',
                        start: 280896,
                        end: 281303,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/decreasing_set.mzn.deprecated.mzn',
                        start: 281303,
                        end: 281455,
                    },
                    {
                        filename: '/usr/share/minizinc/std/diffn.mzn',
                        start: 281455,
                        end: 282210,
                    },
                    {
                        filename: '/usr/share/minizinc/std/diffn_k.mzn',
                        start: 282210,
                        end: 283012,
                    },
                    {
                        filename: '/usr/share/minizinc/std/diffn_nonstrict.mzn',
                        start: 283012,
                        end: 283732,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/diffn_nonstrict_k.mzn',
                        start: 283732,
                        end: 284569,
                    },
                    {
                        filename: '/usr/share/minizinc/std/disjoint.mzn',
                        start: 284569,
                        end: 284796,
                    },
                    {
                        filename: '/usr/share/minizinc/std/disjunctive.mzn',
                        start: 284796,
                        end: 285519,
                    },
                    {
                        filename: '/usr/share/minizinc/std/disjunctive_opt.mzn',
                        start: 285519,
                        end: 286401,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/disjunctive_strict.mzn',
                        start: 286401,
                        end: 287037,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/disjunctive_strict_opt.mzn',
                        start: 287037,
                        end: 287776,
                    },
                    {
                        filename: '/usr/share/minizinc/std/distribute.mzn',
                        start: 287776,
                        end: 288353,
                    },
                    {
                        filename: '/usr/share/minizinc/std/distribute_fn.mzn',
                        start: 288353,
                        end: 288945,
                    },
                    {
                        filename: '/usr/share/minizinc/std/element.mzn',
                        start: 288945,
                        end: 289701,
                    },
                    {
                        filename: '/usr/share/minizinc/std/element_bool.mzn',
                        start: 289701,
                        end: 290010,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/element_bool.mzn.deprecated.mzn',
                        start: 290010,
                        end: 290180,
                    },
                    {
                        filename: '/usr/share/minizinc/std/element_float.mzn',
                        start: 290180,
                        end: 290492,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/element_float.mzn.deprecated.mzn',
                        start: 290492,
                        end: 290665,
                    },
                    {
                        filename: '/usr/share/minizinc/std/element_int.mzn',
                        start: 290665,
                        end: 290971,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/element_int.mzn.deprecated.mzn',
                        start: 290971,
                        end: 291138,
                    },
                    {
                        filename: '/usr/share/minizinc/std/element_set.mzn',
                        start: 291138,
                        end: 291460,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/element_set.mzn.deprecated.mzn',
                        start: 291460,
                        end: 291646,
                    },
                    {
                        filename: '/usr/share/minizinc/std/exactly.mzn',
                        start: 291646,
                        end: 292257,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/exactly.mzn.deprecated.mzn',
                        start: 292257,
                        end: 292411,
                    },
                    {
                        filename: '/usr/share/minizinc/std/exactly_int.mzn',
                        start: 292411,
                        end: 292804,
                    },
                    {
                        filename: '/usr/share/minizinc/std/exactly_set.mzn',
                        start: 292804,
                        end: 293211,
                    },
                    {
                        filename: '/usr/share/minizinc/std/experimental.mzn',
                        start: 293211,
                        end: 294500,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/flatzinc_builtins.mzn',
                        start: 294500,
                        end: 319346,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_all_different_int.mzn',
                        start: 319346,
                        end: 319688,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_all_different_int_opt.mzn',
                        start: 319688,
                        end: 320410,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_all_different_int_reif.mzn',
                        start: 320410,
                        end: 320776,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_all_different_set.mzn',
                        start: 320776,
                        end: 321125,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_all_different_set_reif.mzn',
                        start: 321125,
                        end: 321498,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_all_disjoint.mzn',
                        start: 321498,
                        end: 321663,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_all_disjoint_reif.mzn',
                        start: 321663,
                        end: 321852,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_all_equal_int.mzn',
                        start: 321852,
                        end: 322183,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_all_equal_int_reif.mzn',
                        start: 322183,
                        end: 322538,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_all_equal_set.mzn',
                        start: 322538,
                        end: 322876,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_all_equal_set_reif.mzn',
                        start: 322876,
                        end: 323238,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_alldifferent_except.mzn',
                        start: 323238,
                        end: 323786,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_alldifferent_except_0.mzn',
                        start: 323786,
                        end: 323923,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_alldifferent_except_0_reif.mzn',
                        start: 323923,
                        end: 324096,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_alldifferent_except_reif.mzn',
                        start: 324096,
                        end: 324305,
                    },
                    {
                        filename: '/usr/share/minizinc/std/fzn_alternative.mzn',
                        start: 324305,
                        end: 324574,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_alternative_reif.mzn',
                        start: 324574,
                        end: 324879,
                    },
                    {
                        filename: '/usr/share/minizinc/std/fzn_among.mzn',
                        start: 324879,
                        end: 325002,
                    },
                    {
                        filename: '/usr/share/minizinc/std/fzn_among_reif.mzn',
                        start: 325002,
                        end: 325152,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_arg_max_bool.mzn',
                        start: 325152,
                        end: 325632,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_arg_max_bool_opt.mzn',
                        start: 325632,
                        end: 325869,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_arg_max_float.mzn',
                        start: 325869,
                        end: 326794,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_arg_max_float_opt.mzn',
                        start: 326794,
                        end: 327016,
                    },
                    {
                        filename: '/usr/share/minizinc/std/fzn_arg_max_int.mzn',
                        start: 327016,
                        end: 327493,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_arg_max_int_opt.mzn',
                        start: 327493,
                        end: 327765,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_arg_min_bool.mzn',
                        start: 327765,
                        end: 328239,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_arg_min_bool_opt.mzn',
                        start: 328239,
                        end: 328470,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_arg_min_float.mzn',
                        start: 328470,
                        end: 329393,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_arg_min_float_opt.mzn',
                        start: 329393,
                        end: 329615,
                    },
                    {
                        filename: '/usr/share/minizinc/std/fzn_arg_min_int.mzn',
                        start: 329615,
                        end: 330087,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_arg_min_int_opt.mzn',
                        start: 330087,
                        end: 330359,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_arg_sort_float.mzn',
                        start: 330359,
                        end: 330629,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_arg_sort_float_reif.mzn',
                        start: 330629,
                        end: 330997,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_arg_sort_int.mzn',
                        start: 330997,
                        end: 331261,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_arg_sort_int_reif.mzn',
                        start: 331261,
                        end: 331612,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_array_int_union.mzn',
                        start: 331612,
                        end: 331911,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_array_opt_int_union.mzn',
                        start: 331911,
                        end: 332479,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_array_set_intersect.mzn',
                        start: 332479,
                        end: 333007,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_array_set_union.mzn',
                        start: 333007,
                        end: 333493,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_at_least_int.mzn',
                        start: 333493,
                        end: 333837,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_at_least_int_reif.mzn',
                        start: 333837,
                        end: 334204,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_at_least_set.mzn',
                        start: 334204,
                        end: 334562,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_at_least_set_reif.mzn',
                        start: 334562,
                        end: 334944,
                    },
                    {
                        filename: '/usr/share/minizinc/std/fzn_at_most1.mzn',
                        start: 334944,
                        end: 335092,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_at_most1_reif.mzn',
                        start: 335092,
                        end: 335267,
                    },
                    {
                        filename: '/usr/share/minizinc/std/fzn_at_most_int.mzn',
                        start: 335267,
                        end: 335608,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_at_most_int_reif.mzn',
                        start: 335608,
                        end: 335973,
                    },
                    {
                        filename: '/usr/share/minizinc/std/fzn_at_most_set.mzn',
                        start: 335973,
                        end: 336329,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_at_most_set_reif.mzn',
                        start: 336329,
                        end: 336709,
                    },
                    {
                        filename: '/usr/share/minizinc/std/fzn_bin_packing.mzn',
                        start: 336709,
                        end: 337123,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_bin_packing_capa.mzn',
                        start: 337123,
                        end: 337634,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_bin_packing_capa_reif.mzn',
                        start: 337634,
                        end: 338235,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_bin_packing_load.mzn',
                        start: 338235,
                        end: 338792,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_bin_packing_load_reif.mzn',
                        start: 338792,
                        end: 339441,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_bin_packing_reif.mzn',
                        start: 339441,
                        end: 339885,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_bounded_dpath_enum.mzn',
                        start: 339885,
                        end: 340197,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_bounded_dpath_enum_reif.mzn',
                        start: 340197,
                        end: 340545,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_bounded_dpath_int.mzn',
                        start: 340545,
                        end: 340864,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_bounded_dpath_int_reif.mzn',
                        start: 340864,
                        end: 341219,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_bounded_path_enum.mzn',
                        start: 341219,
                        end: 341529,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_bounded_path_enum_reif.mzn',
                        start: 341529,
                        end: 341875,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_bounded_path_int.mzn',
                        start: 341875,
                        end: 342191,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_bounded_path_int_reif.mzn',
                        start: 342191,
                        end: 342543,
                    },
                    {
                        filename: '/usr/share/minizinc/std/fzn_circuit.mzn',
                        start: 342543,
                        end: 343144,
                    },
                    {
                        filename: '/usr/share/minizinc/std/fzn_circuit_opt.mzn',
                        start: 343144,
                        end: 343403,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_circuit_opt_reif.mzn',
                        start: 343403,
                        end: 343695,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_circuit_reif.mzn',
                        start: 343695,
                        end: 343895,
                    },
                    {
                        filename: '/usr/share/minizinc/std/fzn_connected.mzn',
                        start: 343895,
                        end: 344236,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_connected_reif.mzn',
                        start: 344236,
                        end: 344542,
                    },
                    {
                        filename: '/usr/share/minizinc/std/fzn_cost_mdd.mzn',
                        start: 344542,
                        end: 347580,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_cost_mdd_reif.mzn',
                        start: 347580,
                        end: 348467,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_cost_regular.mzn',
                        start: 348467,
                        end: 349716,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_cost_regular_reif.mzn',
                        start: 349716,
                        end: 35e4,
                    },
                    {
                        filename: '/usr/share/minizinc/std/fzn_count_eq.mzn',
                        start: 35e4,
                        end: 350202,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_count_eq_par.mzn',
                        start: 350202,
                        end: 350408,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_count_eq_par_reif.mzn',
                        start: 350408,
                        end: 350644,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_count_eq_reif.mzn',
                        start: 350644,
                        end: 350845,
                    },
                    {
                        filename: '/usr/share/minizinc/std/fzn_count_geq.mzn',
                        start: 350845,
                        end: 351482,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_count_geq_par.mzn',
                        start: 351482,
                        end: 351691,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_count_geq_par_reif.mzn',
                        start: 351691,
                        end: 351928,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_count_geq_reif.mzn',
                        start: 351928,
                        end: 352313,
                    },
                    {
                        filename: '/usr/share/minizinc/std/fzn_count_gt.mzn',
                        start: 352313,
                        end: 352946,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_count_gt_par.mzn',
                        start: 352946,
                        end: 353150,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_count_gt_par_reif.mzn',
                        start: 353150,
                        end: 353384,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_count_gt_reif.mzn',
                        start: 353384,
                        end: 353766,
                    },
                    {
                        filename: '/usr/share/minizinc/std/fzn_count_leq.mzn',
                        start: 353766,
                        end: 354164,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_count_leq_par.mzn',
                        start: 354164,
                        end: 354371,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_count_leq_par_reif.mzn',
                        start: 354371,
                        end: 354608,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_count_leq_reif.mzn',
                        start: 354608,
                        end: 354993,
                    },
                    {
                        filename: '/usr/share/minizinc/std/fzn_count_lt.mzn',
                        start: 354993,
                        end: 355389,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_count_lt_par.mzn',
                        start: 355389,
                        end: 355593,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_count_lt_par_reif.mzn',
                        start: 355593,
                        end: 355827,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_count_lt_reif.mzn',
                        start: 355827,
                        end: 356209,
                    },
                    {
                        filename: '/usr/share/minizinc/std/fzn_count_neq.mzn',
                        start: 356209,
                        end: 356570,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_count_neq_par.mzn',
                        start: 356570,
                        end: 356777,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_count_neq_par_reif.mzn',
                        start: 356777,
                        end: 357014,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_count_neq_reif.mzn',
                        start: 357014,
                        end: 357399,
                    },
                    {
                        filename: '/usr/share/minizinc/std/fzn_cumulative.mzn',
                        start: 357399,
                        end: 359342,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_cumulative_opt.mzn',
                        start: 359342,
                        end: 359591,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_cumulative_opt_decomp.mzn',
                        start: 359591,
                        end: 361700,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_cumulative_opt_reif.mzn',
                        start: 361700,
                        end: 363864,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_cumulative_reif.mzn',
                        start: 363864,
                        end: 365835,
                    },
                    {
                        filename: '/usr/share/minizinc/std/fzn_dag.mzn',
                        start: 365835,
                        end: 366462,
                    },
                    {
                        filename: '/usr/share/minizinc/std/fzn_dag_reif.mzn',
                        start: 366462,
                        end: 366666,
                    },
                    {
                        filename: '/usr/share/minizinc/std/fzn_dconnected.mzn',
                        start: 366666,
                        end: 367009,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_dconnected_reif.mzn',
                        start: 367009,
                        end: 367343,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_decreasing_bool.mzn',
                        start: 367343,
                        end: 367717,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_decreasing_bool_reif.mzn',
                        start: 367717,
                        end: 368115,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_decreasing_float.mzn',
                        start: 368115,
                        end: 368491,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_decreasing_float_reif.mzn',
                        start: 368491,
                        end: 368891,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_decreasing_int.mzn',
                        start: 368891,
                        end: 369264,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_decreasing_int_reif.mzn',
                        start: 369264,
                        end: 369661,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_decreasing_set.mzn',
                        start: 369661,
                        end: 370041,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_decreasing_set_reif.mzn',
                        start: 370041,
                        end: 370445,
                    },
                    {
                        filename: '/usr/share/minizinc/std/fzn_diffn.mzn',
                        start: 370445,
                        end: 370863,
                    },
                    {
                        filename: '/usr/share/minizinc/std/fzn_diffn_k.mzn',
                        start: 370863,
                        end: 371702,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_diffn_k_reif.mzn',
                        start: 371702,
                        end: 372583,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_diffn_nonstrict.mzn',
                        start: 372583,
                        end: 373016,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_diffn_nonstrict_k.mzn',
                        start: 373016,
                        end: 373990,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_diffn_nonstrict_k_reif.mzn',
                        start: 373990,
                        end: 375006,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_diffn_nonstrict_reif.mzn',
                        start: 375006,
                        end: 375489,
                    },
                    {
                        filename: '/usr/share/minizinc/std/fzn_diffn_reif.mzn',
                        start: 375489,
                        end: 375947,
                    },
                    {
                        filename: '/usr/share/minizinc/std/fzn_disjoint.mzn',
                        start: 375947,
                        end: 376039,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_disjoint_reif.mzn',
                        start: 376039,
                        end: 376155,
                    },
                    {
                        filename: '/usr/share/minizinc/std/fzn_disjunctive.mzn',
                        start: 376155,
                        end: 376438,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_disjunctive_opt.mzn',
                        start: 376438,
                        end: 376787,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_disjunctive_opt_reif.mzn',
                        start: 376787,
                        end: 377192,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_disjunctive_reif.mzn',
                        start: 377192,
                        end: 377581,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_disjunctive_strict.mzn',
                        start: 377581,
                        end: 377856,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_disjunctive_strict_opt.mzn',
                        start: 377856,
                        end: 378085,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_disjunctive_strict_opt_decomp.mzn',
                        start: 378085,
                        end: 378470,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_disjunctive_strict_opt_reif.mzn',
                        start: 378470,
                        end: 378970,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_disjunctive_strict_reif.mzn',
                        start: 378970,
                        end: 379327,
                    },
                    {
                        filename: '/usr/share/minizinc/std/fzn_distribute.mzn',
                        start: 379327,
                        end: 379603,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_distribute_reif.mzn',
                        start: 379603,
                        end: 380006,
                    },
                    {
                        filename: '/usr/share/minizinc/std/fzn_dpath_enum.mzn',
                        start: 380006,
                        end: 381752,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_dpath_enum_reif.mzn',
                        start: 381752,
                        end: 382082,
                    },
                    {
                        filename: '/usr/share/minizinc/std/fzn_dpath_int.mzn',
                        start: 382082,
                        end: 382460,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_dpath_int_reif.mzn',
                        start: 382460,
                        end: 382904,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_dreachable_enum.mzn',
                        start: 382904,
                        end: 384414,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_dreachable_enum_reif.mzn',
                        start: 384414,
                        end: 384778,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_dreachable_int.mzn',
                        start: 384778,
                        end: 386213,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_dreachable_int_reif.mzn',
                        start: 386213,
                        end: 386590,
                    },
                    {
                        filename: '/usr/share/minizinc/std/fzn_dsteiner.mzn',
                        start: 386590,
                        end: 386980,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_dsteiner_reif.mzn',
                        start: 386980,
                        end: 387357,
                    },
                    {
                        filename: '/usr/share/minizinc/std/fzn_dtree_enum.mzn',
                        start: 387357,
                        end: 389116,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_dtree_enum_reif.mzn',
                        start: 389116,
                        end: 389457,
                    },
                    {
                        filename: '/usr/share/minizinc/std/fzn_dtree_int.mzn',
                        start: 389457,
                        end: 391085,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_dtree_int_reif.mzn',
                        start: 391085,
                        end: 391417,
                    },
                    {
                        filename: '/usr/share/minizinc/std/fzn_dwst.mzn',
                        start: 391417,
                        end: 391834,
                    },
                    {
                        filename: '/usr/share/minizinc/std/fzn_dwst_reif.mzn',
                        start: 391834,
                        end: 392172,
                    },
                    {
                        filename: '/usr/share/minizinc/std/fzn_exactly_int.mzn',
                        start: 392172,
                        end: 392513,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_exactly_int_reif.mzn',
                        start: 392513,
                        end: 392878,
                    },
                    {
                        filename: '/usr/share/minizinc/std/fzn_exactly_set.mzn',
                        start: 392878,
                        end: 393233,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_exactly_set_reif.mzn',
                        start: 393233,
                        end: 393612,
                    },
                    {
                        filename: '/usr/share/minizinc/std/fzn_geost.mzn',
                        start: 393612,
                        end: 394833,
                    },
                    {
                        filename: '/usr/share/minizinc/std/fzn_geost_bb.mzn',
                        start: 394833,
                        end: 395897,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_geost_bb_reif.mzn',
                        start: 395897,
                        end: 397060,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_geost_nonoverlap_k.mzn',
                        start: 397060,
                        end: 397354,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_geost_nonoverlap_k_reif.mzn',
                        start: 397354,
                        end: 397676,
                    },
                    {
                        filename: '/usr/share/minizinc/std/fzn_geost_reif.mzn',
                        start: 397676,
                        end: 398976,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_geost_smallest_bb.mzn',
                        start: 398976,
                        end: 400228,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_geost_smallest_bb_reif.mzn',
                        start: 400228,
                        end: 401581,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_global_cardinality.mzn',
                        start: 401581,
                        end: 401889,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_global_cardinality_closed.mzn',
                        start: 401889,
                        end: 402230,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_global_cardinality_closed_opt.mzn',
                        start: 402230,
                        end: 402598,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_global_cardinality_closed_reif.mzn',
                        start: 402598,
                        end: 403017,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_global_cardinality_closed_set.mzn',
                        start: 403017,
                        end: 403372,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_global_cardinality_low_up.mzn',
                        start: 403372,
                        end: 403946,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_global_cardinality_low_up_closed.mzn',
                        start: 403946,
                        end: 404453,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_global_cardinality_low_up_closed_opt.mzn',
                        start: 404453,
                        end: 404924,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_global_cardinality_low_up_closed_reif.mzn',
                        start: 404924,
                        end: 405565,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_global_cardinality_low_up_closed_set.mzn',
                        start: 405565,
                        end: 406022,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_global_cardinality_low_up_opt.mzn',
                        start: 406022,
                        end: 406540,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_global_cardinality_low_up_reif.mzn',
                        start: 406540,
                        end: 407002,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_global_cardinality_low_up_set.mzn',
                        start: 407002,
                        end: 407457,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_global_cardinality_opt.mzn',
                        start: 407457,
                        end: 407879,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_global_cardinality_reif.mzn',
                        start: 407879,
                        end: 408279,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_global_cardinality_set.mzn',
                        start: 408279,
                        end: 408563,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_if_then_else_bool.mzn',
                        start: 408563,
                        end: 408930,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_if_then_else_float.mzn',
                        start: 408930,
                        end: 409300,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_if_then_else_int.mzn',
                        start: 409300,
                        end: 409664,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_if_then_else_opt_bool.mzn',
                        start: 409664,
                        end: 410043,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_if_then_else_opt_float.mzn',
                        start: 410043,
                        end: 410425,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_if_then_else_opt_int.mzn',
                        start: 410425,
                        end: 410801,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_if_then_else_partiality.mzn',
                        start: 410801,
                        end: 411257,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_if_then_else_set.mzn',
                        start: 411257,
                        end: 411635,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_if_then_else_var_bool.mzn',
                        start: 411635,
                        end: 412010,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_if_then_else_var_float.mzn',
                        start: 412010,
                        end: 412388,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_if_then_else_var_int.mzn',
                        start: 412388,
                        end: 412760,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_if_then_else_var_opt_bool.mzn',
                        start: 412760,
                        end: 413147,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_if_then_else_var_opt_float.mzn',
                        start: 413147,
                        end: 413537,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_if_then_else_var_opt_int.mzn',
                        start: 413537,
                        end: 413921,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_if_then_else_var_set.mzn',
                        start: 413921,
                        end: 414307,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_increasing_bool.mzn',
                        start: 414307,
                        end: 414681,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_increasing_bool_opt.mzn',
                        start: 414681,
                        end: 415046,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_increasing_bool_reif.mzn',
                        start: 415046,
                        end: 415444,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_increasing_float.mzn',
                        start: 415444,
                        end: 415820,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_increasing_float_reif.mzn',
                        start: 415820,
                        end: 416220,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_increasing_int.mzn',
                        start: 416220,
                        end: 416592,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_increasing_int_reif.mzn',
                        start: 416592,
                        end: 416988,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_increasing_set.mzn',
                        start: 416988,
                        end: 417367,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_increasing_set_reif.mzn',
                        start: 417367,
                        end: 417770,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_int_set_channel.mzn',
                        start: 417770,
                        end: 418159,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_int_set_channel_reif.mzn',
                        start: 418159,
                        end: 418634,
                    },
                    {
                        filename: '/usr/share/minizinc/std/fzn_inverse.mzn',
                        start: 418634,
                        end: 418936,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_inverse_in_range.mzn',
                        start: 418936,
                        end: 419812,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_inverse_in_range_reif.mzn',
                        start: 419812,
                        end: 420204,
                    },
                    {
                        filename: '/usr/share/minizinc/std/fzn_inverse_opt.mzn',
                        start: 420204,
                        end: 420533,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_inverse_reif.mzn',
                        start: 420533,
                        end: 420916,
                    },
                    {
                        filename: '/usr/share/minizinc/std/fzn_inverse_set.mzn',
                        start: 420916,
                        end: 421293,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_inverse_set_reif.mzn',
                        start: 421293,
                        end: 421764,
                    },
                    {
                        filename: '/usr/share/minizinc/std/fzn_knapsack.mzn',
                        start: 421764,
                        end: 422066,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_knapsack_reif.mzn',
                        start: 422066,
                        end: 422417,
                    },
                    {
                        filename: '/usr/share/minizinc/std/fzn_lex2.mzn',
                        start: 422417,
                        end: 422728,
                    },
                    {
                        filename: '/usr/share/minizinc/std/fzn_lex2_reif.mzn',
                        start: 422728,
                        end: 423097,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_lex_chain_less_bool.mzn',
                        start: 423097,
                        end: 423396,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_lex_chain_less_bool_reif.mzn',
                        start: 423396,
                        end: 423728,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_lex_chain_less_int.mzn',
                        start: 423728,
                        end: 424025,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_lex_chain_less_int_reif.mzn',
                        start: 424025,
                        end: 424355,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_lex_chain_lesseq_bool.mzn',
                        start: 424355,
                        end: 424660,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_lex_chain_lesseq_bool_reif.mzn',
                        start: 424660,
                        end: 424998,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_lex_chain_lesseq_int.mzn',
                        start: 424998,
                        end: 425301,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_lex_chain_lesseq_int_reif.mzn',
                        start: 425301,
                        end: 425637,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_lex_chain_lesseq_orbitope.mzn',
                        start: 425637,
                        end: 426248,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_lex_chain_lesseq_orbitope_reif.mzn',
                        start: 426248,
                        end: 426883,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_lex_less_bool.mzn',
                        start: 426883,
                        end: 427899,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_lex_less_bool_reif.mzn',
                        start: 427899,
                        end: 428924,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_lex_less_float.mzn',
                        start: 428924,
                        end: 429889,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_lex_less_float_reif.mzn',
                        start: 429889,
                        end: 430919,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_lex_less_int.mzn',
                        start: 430919,
                        end: 431931,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_lex_less_int_reif.mzn',
                        start: 431931,
                        end: 432951,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_lex_less_set.mzn',
                        start: 432951,
                        end: 433922,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_lex_less_set_reif.mzn',
                        start: 433922,
                        end: 434956,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_lex_lesseq_bool.mzn',
                        start: 434956,
                        end: 435981,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_lex_lesseq_bool_reif.mzn',
                        start: 435981,
                        end: 437017,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_lex_lesseq_float.mzn',
                        start: 437017,
                        end: 438092,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_lex_lesseq_float_reif.mzn',
                        start: 438092,
                        end: 439234,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_lex_lesseq_int.mzn',
                        start: 439234,
                        end: 440336,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_lex_lesseq_int_reif.mzn',
                        start: 440336,
                        end: 441461,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_lex_lesseq_set.mzn',
                        start: 441461,
                        end: 442542,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_lex_lesseq_set_reif.mzn',
                        start: 442542,
                        end: 443688,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_link_set_to_booleans.mzn',
                        start: 443688,
                        end: 443822,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_link_set_to_booleans_reif.mzn',
                        start: 443822,
                        end: 443982,
                    },
                    {
                        filename: '/usr/share/minizinc/std/fzn_mdd.mzn',
                        start: 443982,
                        end: 445889,
                    },
                    {
                        filename: '/usr/share/minizinc/std/fzn_mdd_nondet.mzn',
                        start: 445889,
                        end: 447529,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_mdd_nondet_reif.mzn',
                        start: 447529,
                        end: 449255,
                    },
                    {
                        filename: '/usr/share/minizinc/std/fzn_mdd_reif.mzn',
                        start: 449255,
                        end: 451707,
                    },
                    {
                        filename: '/usr/share/minizinc/std/fzn_member_bool.mzn',
                        start: 451707,
                        end: 452033,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_member_bool_reif.mzn',
                        start: 452033,
                        end: 452383,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_member_float.mzn',
                        start: 452383,
                        end: 452712,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_member_float_reif.mzn',
                        start: 452712,
                        end: 453065,
                    },
                    {
                        filename: '/usr/share/minizinc/std/fzn_member_int.mzn',
                        start: 453065,
                        end: 453388,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_member_int_reif.mzn',
                        start: 453388,
                        end: 453735,
                    },
                    {
                        filename: '/usr/share/minizinc/std/fzn_member_set.mzn',
                        start: 453735,
                        end: 454072,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_member_set_reif.mzn',
                        start: 454072,
                        end: 454433,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_network_flow.mzn',
                        start: 454433,
                        end: 454950,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_network_flow_cost.mzn',
                        start: 454950,
                        end: 455554,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_network_flow_cost_reif.mzn',
                        start: 455554,
                        end: 456217,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_network_flow_reif.mzn',
                        start: 456217,
                        end: 456781,
                    },
                    {
                        filename: '/usr/share/minizinc/std/fzn_neural_net.mzn',
                        start: 456781,
                        end: 459539,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_neural_net_reif.mzn',
                        start: 459539,
                        end: 460140,
                    },
                    {
                        filename: '/usr/share/minizinc/std/fzn_nvalue.mzn',
                        start: 460140,
                        end: 460370,
                    },
                    {
                        filename: '/usr/share/minizinc/std/fzn_nvalue_reif.mzn',
                        start: 460370,
                        end: 460624,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_partition_set.mzn',
                        start: 460624,
                        end: 460843,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_partition_set_reif.mzn',
                        start: 460843,
                        end: 461127,
                    },
                    {
                        filename: '/usr/share/minizinc/std/fzn_path_enum.mzn',
                        start: 461127,
                        end: 461896,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_path_enum_reif.mzn',
                        start: 461896,
                        end: 462292,
                    },
                    {
                        filename: '/usr/share/minizinc/std/fzn_path_int.mzn',
                        start: 462292,
                        end: 463029,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_path_int_reif.mzn',
                        start: 463029,
                        end: 463444,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_piecewise_linear.mzn',
                        start: 463444,
                        end: 464847,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_piecewise_linear_non_continuous.mzn',
                        start: 464847,
                        end: 466677,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_piecewise_linear_non_continuous_reif.mzn',
                        start: 466677,
                        end: 467192,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_piecewise_linear_reif.mzn',
                        start: 467192,
                        end: 467540,
                    },
                    {
                        filename: '/usr/share/minizinc/std/fzn_range.mzn',
                        start: 467540,
                        end: 467967,
                    },
                    {
                        filename: '/usr/share/minizinc/std/fzn_range_reif.mzn',
                        start: 467967,
                        end: 468462,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_reachable_enum.mzn',
                        start: 468462,
                        end: 469210,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_reachable_enum_reif.mzn',
                        start: 469210,
                        end: 469996,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_reachable_int.mzn',
                        start: 469996,
                        end: 470594,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_reachable_int_reif.mzn',
                        start: 470594,
                        end: 471221,
                    },
                    {
                        filename: '/usr/share/minizinc/std/fzn_regular.mzn',
                        start: 471221,
                        end: 472011,
                    },
                    {
                        filename: '/usr/share/minizinc/std/fzn_regular_nfa.mzn',
                        start: 472011,
                        end: 472816,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_regular_nfa_reif.mzn',
                        start: 472816,
                        end: 473083,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_regular_nfa_set.mzn',
                        start: 473083,
                        end: 473895,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_regular_nfa_set_reif.mzn',
                        start: 473895,
                        end: 474169,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_regular_regexp.mzn',
                        start: 474169,
                        end: 474229,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_regular_reif.mzn',
                        start: 474229,
                        end: 474473,
                    },
                    {
                        filename: '/usr/share/minizinc/std/fzn_regular_set.mzn',
                        start: 474473,
                        end: 475372,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_regular_set.mzn.deprecated.mzn',
                        start: 475372,
                        end: 475596,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_regular_set_reif.mzn',
                        start: 475596,
                        end: 475847,
                    },
                    {
                        filename: '/usr/share/minizinc/std/fzn_roots.mzn',
                        start: 475847,
                        end: 476165,
                    },
                    {
                        filename: '/usr/share/minizinc/std/fzn_roots_reif.mzn',
                        start: 476165,
                        end: 476538,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_seq_precede_chain_int.mzn',
                        start: 476538,
                        end: 476994,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_seq_precede_chain_int_reif.mzn',
                        start: 476994,
                        end: 477142,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_seq_precede_chain_set.mzn',
                        start: 477142,
                        end: 477675,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_seq_precede_chain_set_reif.mzn',
                        start: 477675,
                        end: 477817,
                    },
                    {
                        filename: '/usr/share/minizinc/std/fzn_set_member.mzn',
                        start: 477817,
                        end: 478100,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_set_member_reif.mzn',
                        start: 478100,
                        end: 478407,
                    },
                    {
                        filename: '/usr/share/minizinc/std/fzn_sliding_sum.mzn',
                        start: 478407,
                        end: 479176,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_sliding_sum_reif.mzn',
                        start: 479176,
                        end: 480047,
                    },
                    {
                        filename: '/usr/share/minizinc/std/fzn_sort.mzn',
                        start: 480047,
                        end: 480488,
                    },
                    {
                        filename: '/usr/share/minizinc/std/fzn_sort_reif.mzn',
                        start: 480488,
                        end: 480665,
                    },
                    {
                        filename: '/usr/share/minizinc/std/fzn_span.mzn',
                        start: 480665,
                        end: 480983,
                    },
                    {
                        filename: '/usr/share/minizinc/std/fzn_span_reif.mzn',
                        start: 480983,
                        end: 481376,
                    },
                    {
                        filename: '/usr/share/minizinc/std/fzn_steiner.mzn',
                        start: 481376,
                        end: 481778,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_steiner_reif.mzn',
                        start: 481778,
                        end: 482168,
                    },
                    {
                        filename: '/usr/share/minizinc/std/fzn_strict_lex2.mzn',
                        start: 482168,
                        end: 482494,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_strict_lex2_reif.mzn',
                        start: 482494,
                        end: 482885,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_strictly_decreasing_bool.mzn',
                        start: 482885,
                        end: 483248,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_strictly_decreasing_bool_reif.mzn',
                        start: 483248,
                        end: 483635,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_strictly_decreasing_int.mzn',
                        start: 483635,
                        end: 483996,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_strictly_decreasing_int_opt.mzn',
                        start: 483996,
                        end: 484386,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_strictly_decreasing_int_reif.mzn',
                        start: 484386,
                        end: 484771,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_strictly_increasing_bool.mzn',
                        start: 484771,
                        end: 485134,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_strictly_increasing_bool_reif.mzn',
                        start: 485134,
                        end: 485521,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_strictly_increasing_int.mzn',
                        start: 485521,
                        end: 485882,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_strictly_increasing_int_opt.mzn',
                        start: 485882,
                        end: 486566,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_strictly_increasing_int_reif.mzn',
                        start: 486566,
                        end: 486951,
                    },
                    {
                        filename: '/usr/share/minizinc/std/fzn_subcircuit.mzn',
                        start: 486951,
                        end: 488522,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_subcircuit_reif.mzn',
                        start: 488522,
                        end: 488757,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_subgraph_enum.mzn',
                        start: 488757,
                        end: 489087,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_subgraph_enum_reif.mzn',
                        start: 489087,
                        end: 489474,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_subgraph_int.mzn',
                        start: 489474,
                        end: 489809,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_subgraph_int_reif.mzn',
                        start: 489809,
                        end: 490201,
                    },
                    {
                        filename: '/usr/share/minizinc/std/fzn_sum_pred.mzn',
                        start: 490201,
                        end: 490457,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_sum_pred_reif.mzn',
                        start: 490457,
                        end: 490746,
                    },
                    {
                        filename: '/usr/share/minizinc/std/fzn_sum_set.mzn',
                        start: 490746,
                        end: 490928,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_sum_set_reif.mzn',
                        start: 490928,
                        end: 491135,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_symmetric_all_different.mzn',
                        start: 491135,
                        end: 491291,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_symmetric_all_different_reif.mzn',
                        start: 491291,
                        end: 491515,
                    },
                    {
                        filename: '/usr/share/minizinc/std/fzn_table_bool.mzn',
                        start: 491515,
                        end: 492615,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_table_bool_reif.mzn',
                        start: 492615,
                        end: 493085,
                    },
                    {
                        filename: '/usr/share/minizinc/std/fzn_table_int.mzn',
                        start: 493085,
                        end: 494261,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_table_int_opt.mzn',
                        start: 494261,
                        end: 494926,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_table_int_reif.mzn',
                        start: 494926,
                        end: 498627,
                    },
                    {
                        filename: '/usr/share/minizinc/std/fzn_tree_enum.mzn',
                        start: 498627,
                        end: 499343,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_tree_enum_reif.mzn',
                        start: 499343,
                        end: 499683,
                    },
                    {
                        filename: '/usr/share/minizinc/std/fzn_tree_int.mzn',
                        start: 499683,
                        end: 500393,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_tree_int_reif.mzn',
                        start: 500393,
                        end: 500725,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_value_precede_chain_int.mzn',
                        start: 500725,
                        end: 501421,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_value_precede_chain_int_opt.mzn',
                        start: 501421,
                        end: 501751,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_value_precede_chain_int_reif.mzn',
                        start: 501751,
                        end: 501925,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_value_precede_chain_set.mzn',
                        start: 501925,
                        end: 502161,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_value_precede_chain_set_reif.mzn',
                        start: 502161,
                        end: 502331,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_value_precede_int.mzn',
                        start: 502331,
                        end: 502851,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_value_precede_int_opt.mzn',
                        start: 502851,
                        end: 503090,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_value_precede_int_reif.mzn',
                        start: 503090,
                        end: 503291,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_value_precede_set.mzn',
                        start: 503291,
                        end: 503862,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_value_precede_set_reif.mzn',
                        start: 503862,
                        end: 504056,
                    },
                    {
                        filename: '/usr/share/minizinc/std/fzn_write.mzn',
                        start: 504056,
                        end: 504337,
                    },
                    {
                        filename: '/usr/share/minizinc/std/fzn_write_reif.mzn',
                        start: 504337,
                        end: 504648,
                    },
                    {
                        filename: '/usr/share/minizinc/std/fzn_writes.mzn',
                        start: 504648,
                        end: 505059,
                    },
                    {
                        filename: '/usr/share/minizinc/std/fzn_writes_reif.mzn',
                        start: 505059,
                        end: 505548,
                    },
                    {
                        filename: '/usr/share/minizinc/std/fzn_writes_seq.mzn',
                        start: 505548,
                        end: 506127,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/fzn_writes_seq_reif.mzn',
                        start: 506127,
                        end: 506765,
                    },
                    {
                        filename: '/usr/share/minizinc/std/fzn_wst.mzn',
                        start: 506765,
                        end: 507214,
                    },
                    {
                        filename: '/usr/share/minizinc/std/fzn_wst_reif.mzn',
                        start: 507214,
                        end: 507537,
                    },
                    {
                        filename: '/usr/share/minizinc/std/geost.mzn',
                        start: 507537,
                        end: 516335,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/global_cardinality.mzn',
                        start: 516335,
                        end: 521570,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/global_cardinality_closed.mzn',
                        start: 521570,
                        end: 528044,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/global_cardinality_closed_fn.mzn',
                        start: 528044,
                        end: 528694,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/global_cardinality_fn.mzn',
                        start: 528694,
                        end: 529259,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/global_cardinality_low_up.deprecated.mzn',
                        start: 529259,
                        end: 529611,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/global_cardinality_low_up.mzn',
                        start: 529611,
                        end: 530211,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/global_cardinality_low_up_closed.deprecated.mzn',
                        start: 530211,
                        end: 530591,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/global_cardinality_low_up_closed.mzn',
                        start: 530591,
                        end: 531302,
                    },
                    {
                        filename: '/usr/share/minizinc/std/globals.mzn',
                        start: 531302,
                        end: 536071,
                    },
                    {
                        filename: '/usr/share/minizinc/std/ide/vis.mzn',
                        start: 536071,
                        end: 568385,
                    },
                    {
                        filename: '/usr/share/minizinc/std/ide/vis_bar.html',
                        start: 568385,
                        end: 571985,
                    },
                    {
                        filename: '/usr/share/minizinc/std/ide/vis_gantt.html',
                        start: 571985,
                        end: 583337,
                    },
                    {
                        filename: '/usr/share/minizinc/std/ide/vis_geost.html',
                        start: 583337,
                        end: 590953,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/ide/vis_network.html',
                        start: 590953,
                        end: 595151,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/ide/vis_scatter.html',
                        start: 595151,
                        end: 602286,
                    },
                    {
                        filename: '/usr/share/minizinc/std/increasing.mzn',
                        start: 602286,
                        end: 603380,
                    },
                    {
                        filename: '/usr/share/minizinc/std/increasing_bool.mzn',
                        start: 603380,
                        end: 603784,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/increasing_bool.mzn.deprecated.mzn',
                        start: 603784,
                        end: 603931,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/increasing_float.mzn',
                        start: 603931,
                        end: 604340,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/increasing_float.mzn.deprecated.mzn',
                        start: 604340,
                        end: 604489,
                    },
                    {
                        filename: '/usr/share/minizinc/std/increasing_int.mzn',
                        start: 604489,
                        end: 604888,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/increasing_int.mzn.deprecated.mzn',
                        start: 604888,
                        end: 605033,
                    },
                    {
                        filename: '/usr/share/minizinc/std/increasing_set.mzn',
                        start: 605033,
                        end: 605439,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/increasing_set.mzn.deprecated.mzn',
                        start: 605439,
                        end: 605591,
                    },
                    {
                        filename: '/usr/share/minizinc/std/int_set_channel.mzn',
                        start: 605591,
                        end: 606088,
                    },
                    {
                        filename: '/usr/share/minizinc/std/inverse.mzn',
                        start: 606088,
                        end: 606783,
                    },
                    {
                        filename: '/usr/share/minizinc/std/inverse_fn.mzn',
                        start: 606783,
                        end: 607672,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/inverse_in_range.mzn',
                        start: 607672,
                        end: 608268,
                    },
                    {
                        filename: '/usr/share/minizinc/std/inverse_set.mzn',
                        start: 608268,
                        end: 608698,
                    },
                    {
                        filename: '/usr/share/minizinc/std/knapsack.mzn',
                        start: 608698,
                        end: 609683,
                    },
                    {
                        filename: '/usr/share/minizinc/std/lex2.mzn',
                        start: 609683,
                        end: 609983,
                    },
                    {
                        filename: '/usr/share/minizinc/std/lex2_strict.mzn',
                        start: 609983,
                        end: 610314,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/lex_chain_greater.mzn',
                        start: 610314,
                        end: 611304,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/lex_chain_greatereq.mzn',
                        start: 611304,
                        end: 612294,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/lex_chain_greatereq_orbitope.mzn',
                        start: 612294,
                        end: 612969,
                    },
                    {
                        filename: '/usr/share/minizinc/std/lex_chain_less.mzn',
                        start: 612969,
                        end: 613666,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/lex_chain_less_bool.mzn',
                        start: 613666,
                        end: 614184,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/lex_chain_less_bool.mzn.deprecated.mzn',
                        start: 614184,
                        end: 614341,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/lex_chain_less_int.mzn',
                        start: 614341,
                        end: 614854,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/lex_chain_less_int.mzn.deprecated.mzn',
                        start: 614854,
                        end: 615009,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/lex_chain_lesseq.mzn',
                        start: 615009,
                        end: 616128,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/lex_chain_lesseq_bool.mzn',
                        start: 616128,
                        end: 616649,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/lex_chain_lesseq_bool.mzn.deprecated.mzn',
                        start: 616649,
                        end: 616808,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/lex_chain_lesseq_int.mzn',
                        start: 616808,
                        end: 617324,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/lex_chain_lesseq_int.mzn.deprecated.mzn',
                        start: 617324,
                        end: 617481,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/lex_chain_lesseq_orbitope.mzn',
                        start: 617481,
                        end: 618138,
                    },
                    {
                        filename: '/usr/share/minizinc/std/lex_greater.mzn',
                        start: 618138,
                        end: 619574,
                    },
                    {
                        filename: '/usr/share/minizinc/std/lex_greatereq.mzn',
                        start: 619574,
                        end: 621021,
                    },
                    {
                        filename: '/usr/share/minizinc/std/lex_less.mzn',
                        start: 621021,
                        end: 623988,
                    },
                    {
                        filename: '/usr/share/minizinc/std/lex_less_bool.mzn',
                        start: 623988,
                        end: 624727,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/lex_less_bool.mzn.deprecated.mzn',
                        start: 624727,
                        end: 625117,
                    },
                    {
                        filename: '/usr/share/minizinc/std/lex_less_float.mzn',
                        start: 625117,
                        end: 625959,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/lex_less_float.mzn.deprecated.mzn',
                        start: 625959,
                        end: 626450,
                    },
                    {
                        filename: '/usr/share/minizinc/std/lex_less_int.mzn',
                        start: 626450,
                        end: 627276,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/lex_less_int.mzn.deprecated.mzn',
                        start: 627276,
                        end: 627750,
                    },
                    {
                        filename: '/usr/share/minizinc/std/lex_less_set.mzn',
                        start: 627750,
                        end: 628506,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/lex_less_set.mzn.deprecated.mzn',
                        start: 628506,
                        end: 628917,
                    },
                    {
                        filename: '/usr/share/minizinc/std/lex_lesseq.mzn',
                        start: 628917,
                        end: 631870,
                    },
                    {
                        filename: '/usr/share/minizinc/std/lex_lesseq_bool.mzn',
                        start: 631870,
                        end: 632700,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/lex_lesseq_bool.mzn.deprecated.mzn',
                        start: 632700,
                        end: 633189,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/lex_lesseq_float.mzn',
                        start: 633189,
                        end: 634031,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/lex_lesseq_float.mzn.deprecated.mzn',
                        start: 634031,
                        end: 634527,
                    },
                    {
                        filename: '/usr/share/minizinc/std/lex_lesseq_int.mzn',
                        start: 634527,
                        end: 635345,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/lex_lesseq_int.mzn.deprecated.mzn',
                        start: 635345,
                        end: 635825,
                    },
                    {
                        filename: '/usr/share/minizinc/std/lex_lesseq_set.mzn',
                        start: 635825,
                        end: 636579,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/lex_lesseq_set.mzn.deprecated.mzn',
                        start: 636579,
                        end: 636995,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/link_set_to_booleans.mzn',
                        start: 636995,
                        end: 637582,
                    },
                    {
                        filename: '/usr/share/minizinc/std/maximum.mzn',
                        start: 637582,
                        end: 637987,
                    },
                    {
                        filename: '/usr/share/minizinc/std/mdd.mzn',
                        start: 637987,
                        end: 641148,
                    },
                    {
                        filename: '/usr/share/minizinc/std/mdd_nondet.mzn',
                        start: 641148,
                        end: 644154,
                    },
                    {
                        filename: '/usr/share/minizinc/std/member.mzn',
                        start: 644154,
                        end: 645279,
                    },
                    {
                        filename: '/usr/share/minizinc/std/member_bool.mzn',
                        start: 645279,
                        end: 645651,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/member_bool.mzn.deprecated.mzn',
                        start: 645651,
                        end: 645808,
                    },
                    {
                        filename: '/usr/share/minizinc/std/member_float.mzn',
                        start: 645808,
                        end: 646186,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/member_float.mzn.deprecated.mzn',
                        start: 646186,
                        end: 646346,
                    },
                    {
                        filename: '/usr/share/minizinc/std/member_int.mzn',
                        start: 646346,
                        end: 646712,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/member_int.mzn.deprecated.mzn',
                        start: 646712,
                        end: 646866,
                    },
                    {
                        filename: '/usr/share/minizinc/std/member_set.mzn',
                        start: 646866,
                        end: 647246,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/member_set.mzn.deprecated.mzn',
                        start: 647246,
                        end: 647414,
                    },
                    {
                        filename: '/usr/share/minizinc/std/minimum.mzn',
                        start: 647414,
                        end: 647819,
                    },
                    {
                        filename: '/usr/share/minizinc/std/network_flow.mzn',
                        start: 647819,
                        end: 649759,
                    },
                    {
                        filename: '/usr/share/minizinc/std/neural_net.mzn',
                        start: 649759,
                        end: 653331,
                    },
                    {
                        filename: '/usr/share/minizinc/std/nosets.mzn',
                        start: 653331,
                        end: 668496,
                    },
                    {
                        filename: '/usr/share/minizinc/std/nvalue.mzn',
                        start: 668496,
                        end: 668736,
                    },
                    {
                        filename: '/usr/share/minizinc/std/nvalue_fn.mzn',
                        start: 668736,
                        end: 668988,
                    },
                    {
                        filename: '/usr/share/minizinc/std/output.mzn',
                        start: 668988,
                        end: 669205,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/output/array2d_bool.mzn',
                        start: 669205,
                        end: 670061,
                    },
                    {
                        filename: '/usr/share/minizinc/std/output/gantt.mzn',
                        start: 670061,
                        end: 672011,
                    },
                    {
                        filename: '/usr/share/minizinc/std/partition_set.mzn',
                        start: 672011,
                        end: 672316,
                    },
                    {
                        filename: '/usr/share/minizinc/std/path.mzn',
                        start: 672316,
                        end: 676980,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/piecewise_linear.mzn',
                        start: 676980,
                        end: 677894,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/piecewise_linear_non_continuous.mzn',
                        start: 677894,
                        end: 679157,
                    },
                    {
                        filename: '/usr/share/minizinc/std/range.mzn',
                        start: 679157,
                        end: 679650,
                    },
                    {
                        filename: '/usr/share/minizinc/std/range_fn.mzn',
                        start: 679650,
                        end: 680110,
                    },
                    {
                        filename: '/usr/share/minizinc/std/reachable.mzn',
                        start: 680110,
                        end: 684699,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/redefinitions-2.0.2.mzn',
                        start: 684699,
                        end: 685636,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/redefinitions-2.0.mzn',
                        start: 685636,
                        end: 687404,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/redefinitions-2.1.1.mzn',
                        start: 687404,
                        end: 689363,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/redefinitions-2.1.mzn',
                        start: 689363,
                        end: 689727,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/redefinitions-2.2.1.mzn',
                        start: 689727,
                        end: 690069,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/redefinitions-2.3.3.mzn',
                        start: 690069,
                        end: 690484,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/redefinitions-2.5.2.mzn',
                        start: 690484,
                        end: 691946,
                    },
                    {
                        filename: '/usr/share/minizinc/std/redefinitions.mzn',
                        start: 691946,
                        end: 692039,
                    },
                    {
                        filename: '/usr/share/minizinc/std/regular.mzn',
                        start: 692039,
                        end: 694617,
                    },
                    {
                        filename: '/usr/share/minizinc/std/regular_nfa.mzn',
                        start: 694617,
                        end: 697277,
                    },
                    {
                        filename: '/usr/share/minizinc/std/regular_regexp.mzn',
                        start: 697277,
                        end: 698576,
                    },
                    {
                        filename: '/usr/share/minizinc/std/regular_set.mzn',
                        start: 698576,
                        end: 698634,
                    },
                    {
                        filename: '/usr/share/minizinc/std/roots.mzn',
                        start: 698634,
                        end: 698993,
                    },
                    {
                        filename: '/usr/share/minizinc/std/roots_fn.mzn',
                        start: 698993,
                        end: 699314,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/seq_precede_chain.mzn',
                        start: 699314,
                        end: 699915,
                    },
                    {
                        filename: '/usr/share/minizinc/std/set_member.mzn',
                        start: 699915,
                        end: 700274,
                    },
                    {
                        filename: '/usr/share/minizinc/std/sliding_sum.mzn',
                        start: 700274,
                        end: 700629,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/solver_redefinitions.mzn',
                        start: 700629,
                        end: 702284,
                    },
                    {
                        filename: '/usr/share/minizinc/std/sort.mzn',
                        start: 702284,
                        end: 702692,
                    },
                    {
                        filename: '/usr/share/minizinc/std/sort_fn.mzn',
                        start: 702692,
                        end: 703071,
                    },
                    {
                        filename: '/usr/share/minizinc/std/span.mzn',
                        start: 703071,
                        end: 703538,
                    },
                    {
                        filename: '/usr/share/minizinc/std/stdlib.mzn',
                        start: 703538,
                        end: 705712,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/stdlib/stdlib_ann.mzn',
                        start: 705712,
                        end: 731187,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/stdlib/stdlib_array.mzn',
                        start: 731187,
                        end: 747812,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/stdlib/stdlib_coercion.mzn',
                        start: 747812,
                        end: 756412,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/stdlib/stdlib_compare.mzn',
                        start: 756412,
                        end: 776524,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/stdlib/stdlib_debug.mzn',
                        start: 776524,
                        end: 780303,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/stdlib/stdlib_enum.mzn',
                        start: 780303,
                        end: 786414,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/stdlib/stdlib_internal.mzn',
                        start: 786414,
                        end: 849070,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/stdlib/stdlib_ite.mzn',
                        start: 849070,
                        end: 855972,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/stdlib/stdlib_language.mzn',
                        start: 855972,
                        end: 859605,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/stdlib/stdlib_logic.mzn',
                        start: 859605,
                        end: 868061,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/stdlib/stdlib_math.mzn',
                        start: 868061,
                        end: 901263,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/stdlib/stdlib_opt.mzn',
                        start: 901263,
                        end: 913179,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/stdlib/stdlib_random.mzn',
                        start: 913179,
                        end: 917416,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/stdlib/stdlib_reflect.mzn',
                        start: 917416,
                        end: 923760,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/stdlib/stdlib_set.mzn',
                        start: 923760,
                        end: 932851,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/stdlib/stdlib_sort.mzn',
                        start: 932851,
                        end: 934759,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/stdlib/stdlib_string.mzn',
                        start: 934759,
                        end: 943104,
                    },
                    {
                        filename: '/usr/share/minizinc/std/steiner.mzn',
                        start: 943104,
                        end: 946129,
                    },
                    {
                        filename: '/usr/share/minizinc/std/strict_lex2.mzn',
                        start: 946129,
                        end: 946461,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/strictly_decreasing.mzn',
                        start: 946461,
                        end: 948013,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/strictly_increasing.mzn',
                        start: 948013,
                        end: 949566,
                    },
                    {
                        filename: '/usr/share/minizinc/std/subcircuit.mzn',
                        start: 949566,
                        end: 950001,
                    },
                    {
                        filename: '/usr/share/minizinc/std/subgraph.mzn',
                        start: 950001,
                        end: 952141,
                    },
                    {
                        filename: '/usr/share/minizinc/std/sum_pred.mzn',
                        start: 952141,
                        end: 952607,
                    },
                    {
                        filename: '/usr/share/minizinc/std/sum_set.mzn',
                        start: 952607,
                        end: 952978,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/symmetric_all_different.mzn',
                        start: 952978,
                        end: 953399,
                    },
                    {
                        filename: '/usr/share/minizinc/std/table.mzn',
                        start: 953399,
                        end: 954842,
                    },
                    {
                        filename: '/usr/share/minizinc/std/table_bool.mzn',
                        start: 954842,
                        end: 955395,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/table_bool.mzn.deprecated.mzn',
                        start: 955395,
                        end: 955570,
                    },
                    {
                        filename: '/usr/share/minizinc/std/table_int.mzn',
                        start: 955570,
                        end: 956116,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/table_int.mzn.deprecated.mzn',
                        start: 956116,
                        end: 956288,
                    },
                    {
                        filename: '/usr/share/minizinc/std/tree.mzn',
                        start: 956288,
                        end: 960748,
                    },
                    {
                        filename: '/usr/share/minizinc/std/value_precede.mzn',
                        start: 960748,
                        end: 961960,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/value_precede_chain.mzn',
                        start: 961960,
                        end: 963364,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/value_precede_chain_int.mzn',
                        start: 963364,
                        end: 963579,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/value_precede_chain_int.mzn.deprecated.mzn',
                        start: 963579,
                        end: 963756,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/value_precede_chain_set.mzn',
                        start: 963756,
                        end: 963978,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/value_precede_chain_set.mzn.deprecated.mzn',
                        start: 963978,
                        end: 964162,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/value_precede_int.mzn',
                        start: 964162,
                        end: 964350,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/value_precede_int.mzn.deprecated.mzn',
                        start: 964350,
                        end: 964515,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/value_precede_set.mzn',
                        start: 964515,
                        end: 964710,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/value_precede_set.mzn.deprecated.mzn',
                        start: 964710,
                        end: 964882,
                    },
                    {
                        filename:
                            '/usr/share/minizinc/std/weighted_spanning_tree.mzn',
                        start: 964882,
                        end: 967192,
                    },
                    {
                        filename: '/usr/share/minizinc/std/write.mzn',
                        start: 967192,
                        end: 968029,
                    },
                    {
                        filename: '/usr/share/minizinc/std/writes.mzn',
                        start: 968029,
                        end: 969469,
                    },
                    {
                        filename: '/usr/share/minizinc/std/writes_seq.mzn',
                        start: 969469,
                        end: 970607,
                    },
                ],
                remote_package_size: 411638,
            });
        })();
        var moduleOverrides = Object.assign({}, Module);
        var arguments_ = [];
        var thisProgram = './this.program';
        var quit_ = (status, toThrow) => {
            throw toThrow;
        };
        var ENVIRONMENT_IS_WEB = typeof window == 'object';
        var ENVIRONMENT_IS_WORKER = typeof importScripts == 'function';
        var ENVIRONMENT_IS_NODE =
            typeof process == 'object' &&
            typeof process.versions == 'object' &&
            typeof process.versions.node == 'string';
        var scriptDirectory = '';
        function locateFile(path) {
            if (Module['locateFile']) {
                return Module['locateFile'](path, scriptDirectory);
            }
            return scriptDirectory + path;
        }
        var read_, readAsync, readBinary, setWindowTitle;
        function logExceptionOnExit(e) {
            if (e instanceof ExitStatus) return;
            let toLog = e;
            err('exiting due to exception: ' + toLog);
        }
        if (ENVIRONMENT_IS_NODE) {
            if (ENVIRONMENT_IS_WORKER) {
                scriptDirectory =
                    require('path').dirname(scriptDirectory) + '/';
            } else {
                scriptDirectory = __dirname + '/';
            }
            var fs, nodePath;
            if (typeof require === 'function') {
                fs = require('fs');
                nodePath = require('path');
            }
            read_ = (filename, binary) => {
                filename = nodePath['normalize'](filename);
                return fs.readFileSync(filename, binary ? undefined : 'utf8');
            };
            readBinary = (filename) => {
                var ret = read_(filename, true);
                if (!ret.buffer) {
                    ret = new Uint8Array(ret);
                }
                return ret;
            };
            readAsync = (filename, onload, onerror) => {
                filename = nodePath['normalize'](filename);
                fs.readFile(filename, function (err, data) {
                    if (err) onerror(err);
                    else onload(data.buffer);
                });
            };
            if (process['argv'].length > 1) {
                thisProgram = process['argv'][1].replace(/\\/g, '/');
            }
            arguments_ = process['argv'].slice(2);
            process['on']('uncaughtException', function (ex) {
                if (!(ex instanceof ExitStatus)) {
                    throw ex;
                }
            });
            process['on']('unhandledRejection', function (reason) {
                throw reason;
            });
            quit_ = (status, toThrow) => {
                if (keepRuntimeAlive()) {
                    process['exitCode'] = status;
                    throw toThrow;
                }
                logExceptionOnExit(toThrow);
                process['exit'](status);
            };
            Module['inspect'] = function () {
                return '[Emscripten Module object]';
            };
        } else if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
            if (ENVIRONMENT_IS_WORKER) {
                scriptDirectory = self.location.href;
            } else if (
                typeof document != 'undefined' &&
                document.currentScript
            ) {
                scriptDirectory = document.currentScript.src;
            }
            if (_scriptDir) {
                scriptDirectory = _scriptDir;
            }
            if (scriptDirectory.indexOf('blob:') !== 0) {
                scriptDirectory = scriptDirectory.substr(
                    0,
                    scriptDirectory.replace(/[?#].*/, '').lastIndexOf('/') + 1
                );
            } else {
                scriptDirectory = '';
            }
            {
                read_ = (url) => {
                    var xhr = new XMLHttpRequest();
                    xhr.open('GET', url, false);
                    xhr.send(null);
                    return xhr.responseText;
                };
                if (ENVIRONMENT_IS_WORKER) {
                    readBinary = (url) => {
                        var xhr = new XMLHttpRequest();
                        xhr.open('GET', url, false);
                        xhr.responseType = 'arraybuffer';
                        xhr.send(null);
                        return new Uint8Array(xhr.response);
                    };
                }
                readAsync = (url, onload, onerror) => {
                    var xhr = new XMLHttpRequest();
                    xhr.open('GET', url, true);
                    xhr.responseType = 'arraybuffer';
                    xhr.onload = () => {
                        if (
                            xhr.status == 200 ||
                            (xhr.status == 0 && xhr.response)
                        ) {
                            onload(xhr.response);
                            return;
                        }
                        onerror();
                    };
                    xhr.onerror = onerror;
                    xhr.send(null);
                };
            }
            setWindowTitle = (title) => (document.title = title);
        } else {
        }
        var out = Module['print'] || console.log.bind(console);
        var err = Module['printErr'] || console.warn.bind(console);
        Object.assign(Module, moduleOverrides);
        moduleOverrides = null;
        if (Module['arguments']) arguments_ = Module['arguments'];
        if (Module['thisProgram']) thisProgram = Module['thisProgram'];
        if (Module['quit']) quit_ = Module['quit'];
        var wasmBinary;
        if (Module['wasmBinary']) wasmBinary = Module['wasmBinary'];
        var noExitRuntime = Module['noExitRuntime'] || true;
        if (typeof WebAssembly != 'object') {
            abort('no native wasm support detected');
        }
        var wasmMemory;
        var ABORT = false;
        var EXITSTATUS;
        function assert(condition, text) {
            if (!condition) {
                abort(text);
            }
        }
        var UTF8Decoder =
            typeof TextDecoder != 'undefined'
                ? new TextDecoder('utf8')
                : undefined;
        function UTF8ArrayToString(heapOrArray, idx, maxBytesToRead) {
            var endIdx = idx + maxBytesToRead;
            var endPtr = idx;
            while (heapOrArray[endPtr] && !(endPtr >= endIdx)) ++endPtr;
            if (endPtr - idx > 16 && heapOrArray.buffer && UTF8Decoder) {
                return UTF8Decoder.decode(heapOrArray.subarray(idx, endPtr));
            }
            var str = '';
            while (idx < endPtr) {
                var u0 = heapOrArray[idx++];
                if (!(u0 & 128)) {
                    str += String.fromCharCode(u0);
                    continue;
                }
                var u1 = heapOrArray[idx++] & 63;
                if ((u0 & 224) == 192) {
                    str += String.fromCharCode(((u0 & 31) << 6) | u1);
                    continue;
                }
                var u2 = heapOrArray[idx++] & 63;
                if ((u0 & 240) == 224) {
                    u0 = ((u0 & 15) << 12) | (u1 << 6) | u2;
                } else {
                    u0 =
                        ((u0 & 7) << 18) |
                        (u1 << 12) |
                        (u2 << 6) |
                        (heapOrArray[idx++] & 63);
                }
                if (u0 < 65536) {
                    str += String.fromCharCode(u0);
                } else {
                    var ch = u0 - 65536;
                    str += String.fromCharCode(
                        55296 | (ch >> 10),
                        56320 | (ch & 1023)
                    );
                }
            }
            return str;
        }
        function UTF8ToString(ptr, maxBytesToRead) {
            return ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead) : '';
        }
        function stringToUTF8Array(str, heap, outIdx, maxBytesToWrite) {
            if (!(maxBytesToWrite > 0)) return 0;
            var startIdx = outIdx;
            var endIdx = outIdx + maxBytesToWrite - 1;
            for (var i = 0; i < str.length; ++i) {
                var u = str.charCodeAt(i);
                if (u >= 55296 && u <= 57343) {
                    var u1 = str.charCodeAt(++i);
                    u = (65536 + ((u & 1023) << 10)) | (u1 & 1023);
                }
                if (u <= 127) {
                    if (outIdx >= endIdx) break;
                    heap[outIdx++] = u;
                } else if (u <= 2047) {
                    if (outIdx + 1 >= endIdx) break;
                    heap[outIdx++] = 192 | (u >> 6);
                    heap[outIdx++] = 128 | (u & 63);
                } else if (u <= 65535) {
                    if (outIdx + 2 >= endIdx) break;
                    heap[outIdx++] = 224 | (u >> 12);
                    heap[outIdx++] = 128 | ((u >> 6) & 63);
                    heap[outIdx++] = 128 | (u & 63);
                } else {
                    if (outIdx + 3 >= endIdx) break;
                    heap[outIdx++] = 240 | (u >> 18);
                    heap[outIdx++] = 128 | ((u >> 12) & 63);
                    heap[outIdx++] = 128 | ((u >> 6) & 63);
                    heap[outIdx++] = 128 | (u & 63);
                }
            }
            heap[outIdx] = 0;
            return outIdx - startIdx;
        }
        function stringToUTF8(str, outPtr, maxBytesToWrite) {
            return stringToUTF8Array(str, HEAPU8, outPtr, maxBytesToWrite);
        }
        function lengthBytesUTF8(str) {
            var len = 0;
            for (var i = 0; i < str.length; ++i) {
                var c = str.charCodeAt(i);
                if (c <= 127) {
                    len++;
                } else if (c <= 2047) {
                    len += 2;
                } else if (c >= 55296 && c <= 57343) {
                    len += 4;
                    ++i;
                } else {
                    len += 3;
                }
            }
            return len;
        }
        var buffer,
            HEAP8,
            HEAPU8,
            HEAP16,
            HEAPU16,
            HEAP32,
            HEAPU32,
            HEAPF32,
            HEAPF64;
        function updateGlobalBufferAndViews(buf) {
            buffer = buf;
            Module['HEAP8'] = HEAP8 = new Int8Array(buf);
            Module['HEAP16'] = HEAP16 = new Int16Array(buf);
            Module['HEAP32'] = HEAP32 = new Int32Array(buf);
            Module['HEAPU8'] = HEAPU8 = new Uint8Array(buf);
            Module['HEAPU16'] = HEAPU16 = new Uint16Array(buf);
            Module['HEAPU32'] = HEAPU32 = new Uint32Array(buf);
            Module['HEAPF32'] = HEAPF32 = new Float32Array(buf);
            Module['HEAPF64'] = HEAPF64 = new Float64Array(buf);
        }
        var INITIAL_MEMORY = Module['INITIAL_MEMORY'] || 16777216;
        var wasmTable;
        var __ATPRERUN__ = [];
        var __ATINIT__ = [];
        var __ATMAIN__ = [];
        var __ATPOSTRUN__ = [];
        var runtimeInitialized = false;
        function keepRuntimeAlive() {
            return noExitRuntime;
        }
        function preRun() {
            if (Module['preRun']) {
                if (typeof Module['preRun'] == 'function')
                    Module['preRun'] = [Module['preRun']];
                while (Module['preRun'].length) {
                    addOnPreRun(Module['preRun'].shift());
                }
            }
            callRuntimeCallbacks(__ATPRERUN__);
        }
        function initRuntime() {
            runtimeInitialized = true;
            if (!Module['noFSInit'] && !FS.init.initialized) FS.init();
            FS.ignorePermissions = false;
            TTY.init();
            PIPEFS.root = FS.mount(PIPEFS, {}, null);
            callRuntimeCallbacks(__ATINIT__);
        }
        function preMain() {
            callRuntimeCallbacks(__ATMAIN__);
        }
        function postRun() {
            if (Module['postRun']) {
                if (typeof Module['postRun'] == 'function')
                    Module['postRun'] = [Module['postRun']];
                while (Module['postRun'].length) {
                    addOnPostRun(Module['postRun'].shift());
                }
            }
            callRuntimeCallbacks(__ATPOSTRUN__);
        }
        function addOnPreRun(cb) {
            __ATPRERUN__.unshift(cb);
        }
        function addOnInit(cb) {
            __ATINIT__.unshift(cb);
        }
        function addOnPostRun(cb) {
            __ATPOSTRUN__.unshift(cb);
        }
        var runDependencies = 0;
        var runDependencyWatcher = null;
        var dependenciesFulfilled = null;
        function getUniqueRunDependency(id) {
            return id;
        }
        function addRunDependency(id) {
            runDependencies++;
            if (Module['monitorRunDependencies']) {
                Module['monitorRunDependencies'](runDependencies);
            }
        }
        function removeRunDependency(id) {
            runDependencies--;
            if (Module['monitorRunDependencies']) {
                Module['monitorRunDependencies'](runDependencies);
            }
            if (runDependencies == 0) {
                if (runDependencyWatcher !== null) {
                    clearInterval(runDependencyWatcher);
                    runDependencyWatcher = null;
                }
                if (dependenciesFulfilled) {
                    var callback = dependenciesFulfilled;
                    dependenciesFulfilled = null;
                    callback();
                }
            }
        }
        function abort(what) {
            {
                if (Module['onAbort']) {
                    Module['onAbort'](what);
                }
            }
            what = 'Aborted(' + what + ')';
            err(what);
            ABORT = true;
            EXITSTATUS = 1;
            what += '. Build with -sASSERTIONS for more info.';
            var e = new WebAssembly.RuntimeError(what);
            readyPromiseReject(e);
            throw e;
        }
        var dataURIPrefix = 'data:application/octet-stream;base64,';
        function isDataURI(filename) {
            return filename.startsWith(dataURIPrefix);
        }
        function isFileURI(filename) {
            return filename.startsWith('file://');
        }
        var wasmBinaryFile;
        wasmBinaryFile = 'minizinc.wasm';
        if (!isDataURI(wasmBinaryFile)) {
            wasmBinaryFile = locateFile(wasmBinaryFile);
        }
        function getBinary(file) {
            try {
                if (file == wasmBinaryFile && wasmBinary) {
                    return new Uint8Array(wasmBinary);
                }
                if (readBinary) {
                    return readBinary(file);
                }
                throw 'both async and sync fetching of the wasm failed';
            } catch (err) {
                abort(err);
            }
        }
        function getBinaryPromise() {
            if (!wasmBinary && (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER)) {
                if (typeof fetch == 'function' && !isFileURI(wasmBinaryFile)) {
                    return fetch(wasmBinaryFile, { credentials: 'same-origin' })
                        .then(function (response) {
                            if (!response['ok']) {
                                throw (
                                    "failed to load wasm binary file at '" +
                                    wasmBinaryFile +
                                    "'"
                                );
                            }
                            return response['arrayBuffer']();
                        })
                        .catch(function () {
                            return getBinary(wasmBinaryFile);
                        });
                } else {
                    if (readAsync) {
                        return new Promise(function (resolve, reject) {
                            readAsync(
                                wasmBinaryFile,
                                function (response) {
                                    resolve(new Uint8Array(response));
                                },
                                reject
                            );
                        });
                    }
                }
            }
            return Promise.resolve().then(function () {
                return getBinary(wasmBinaryFile);
            });
        }
        function createWasm() {
            var info = { a: asmLibraryArg };
            function receiveInstance(instance, module) {
                var exports = instance.exports;
                Module['asm'] = exports;
                wasmMemory = Module['asm']['mb'];
                updateGlobalBufferAndViews(wasmMemory.buffer);
                wasmTable = Module['asm']['pb'];
                addOnInit(Module['asm']['nb']);
                removeRunDependency('wasm-instantiate');
            }
            addRunDependency('wasm-instantiate');
            function receiveInstantiationResult(result) {
                receiveInstance(result['instance']);
            }
            function instantiateArrayBuffer(receiver) {
                return getBinaryPromise()
                    .then(function (binary) {
                        return WebAssembly.instantiate(binary, info);
                    })
                    .then(function (instance) {
                        return instance;
                    })
                    .then(receiver, function (reason) {
                        err('failed to asynchronously prepare wasm: ' + reason);
                        abort(reason);
                    });
            }
            function instantiateAsync() {
                if (
                    !wasmBinary &&
                    typeof WebAssembly.instantiateStreaming == 'function' &&
                    !isDataURI(wasmBinaryFile) &&
                    !isFileURI(wasmBinaryFile) &&
                    !ENVIRONMENT_IS_NODE &&
                    typeof fetch == 'function'
                ) {
                    return fetch(wasmBinaryFile, {
                        credentials: 'same-origin',
                    }).then(function (response) {
                        var result = WebAssembly.instantiateStreaming(
                            response,
                            info
                        );
                        return result.then(
                            receiveInstantiationResult,
                            function (reason) {
                                err('wasm streaming compile failed: ' + reason);
                                err(
                                    'falling back to ArrayBuffer instantiation'
                                );
                                return instantiateArrayBuffer(
                                    receiveInstantiationResult
                                );
                            }
                        );
                    });
                } else {
                    return instantiateArrayBuffer(receiveInstantiationResult);
                }
            }
            if (Module['instantiateWasm']) {
                try {
                    var exports = Module['instantiateWasm'](
                        info,
                        receiveInstance
                    );
                    return exports;
                } catch (e) {
                    err(
                        'Module.instantiateWasm callback failed with error: ' +
                            e
                    );
                    readyPromiseReject(e);
                }
            }
            instantiateAsync().catch(readyPromiseReject);
            return {};
        }
        var tempDouble;
        var tempI64;
        function ExitStatus(status) {
            this.name = 'ExitStatus';
            this.message = 'Program terminated with exit(' + status + ')';
            this.status = status;
        }
        function callRuntimeCallbacks(callbacks) {
            while (callbacks.length > 0) {
                callbacks.shift()(Module);
            }
        }
        function ___assert_fail(condition, filename, line, func) {
            abort(
                'Assertion failed: ' +
                    UTF8ToString(condition) +
                    ', at: ' +
                    [
                        filename ? UTF8ToString(filename) : 'unknown filename',
                        line,
                        func ? UTF8ToString(func) : 'unknown function',
                    ]
            );
        }
        function getWasmTableEntry(funcPtr) {
            return wasmTable.get(funcPtr);
        }
        function ___call_sighandler(fp, sig) {
            getWasmTableEntry(fp)(sig);
        }
        function ___cxa_allocate_exception(size) {
            return _malloc(size + 24) + 24;
        }
        var exceptionCaught = [];
        function exception_addRef(info) {
            info.add_ref();
        }
        var uncaughtExceptionCount = 0;
        function ___cxa_begin_catch(ptr) {
            var info = new ExceptionInfo(ptr);
            if (!info.get_caught()) {
                info.set_caught(true);
                uncaughtExceptionCount--;
            }
            info.set_rethrown(false);
            exceptionCaught.push(info);
            exception_addRef(info);
            return info.get_exception_ptr();
        }
        function ___cxa_call_unexpected(exception) {
            err(
                'Unexpected exception thrown, this is not properly supported - aborting'
            );
            ABORT = true;
            throw exception;
        }
        function ___cxa_current_primary_exception() {
            if (!exceptionCaught.length) {
                return 0;
            }
            var info = exceptionCaught[exceptionCaught.length - 1];
            exception_addRef(info);
            return info.excPtr;
        }
        function ExceptionInfo(excPtr) {
            this.excPtr = excPtr;
            this.ptr = excPtr - 24;
            this.set_type = function (type) {
                HEAPU32[(this.ptr + 4) >> 2] = type;
            };
            this.get_type = function () {
                return HEAPU32[(this.ptr + 4) >> 2];
            };
            this.set_destructor = function (destructor) {
                HEAPU32[(this.ptr + 8) >> 2] = destructor;
            };
            this.get_destructor = function () {
                return HEAPU32[(this.ptr + 8) >> 2];
            };
            this.set_refcount = function (refcount) {
                HEAP32[this.ptr >> 2] = refcount;
            };
            this.set_caught = function (caught) {
                caught = caught ? 1 : 0;
                HEAP8[(this.ptr + 12) >> 0] = caught;
            };
            this.get_caught = function () {
                return HEAP8[(this.ptr + 12) >> 0] != 0;
            };
            this.set_rethrown = function (rethrown) {
                rethrown = rethrown ? 1 : 0;
                HEAP8[(this.ptr + 13) >> 0] = rethrown;
            };
            this.get_rethrown = function () {
                return HEAP8[(this.ptr + 13) >> 0] != 0;
            };
            this.init = function (type, destructor) {
                this.set_adjusted_ptr(0);
                this.set_type(type);
                this.set_destructor(destructor);
                this.set_refcount(0);
                this.set_caught(false);
                this.set_rethrown(false);
            };
            this.add_ref = function () {
                var value = HEAP32[this.ptr >> 2];
                HEAP32[this.ptr >> 2] = value + 1;
            };
            this.release_ref = function () {
                var prev = HEAP32[this.ptr >> 2];
                HEAP32[this.ptr >> 2] = prev - 1;
                return prev === 1;
            };
            this.set_adjusted_ptr = function (adjustedPtr) {
                HEAPU32[(this.ptr + 16) >> 2] = adjustedPtr;
            };
            this.get_adjusted_ptr = function () {
                return HEAPU32[(this.ptr + 16) >> 2];
            };
            this.get_exception_ptr = function () {
                var isPointer = ___cxa_is_pointer_type(this.get_type());
                if (isPointer) {
                    return HEAPU32[this.excPtr >> 2];
                }
                var adjusted = this.get_adjusted_ptr();
                if (adjusted !== 0) return adjusted;
                return this.excPtr;
            };
        }
        function ___cxa_free_exception(ptr) {
            return _free(new ExceptionInfo(ptr).ptr);
        }
        function exception_decRef(info) {
            if (info.release_ref() && !info.get_rethrown()) {
                var destructor = info.get_destructor();
                if (destructor) {
                    getWasmTableEntry(destructor)(info.excPtr);
                }
                ___cxa_free_exception(info.excPtr);
            }
        }
        function ___cxa_decrement_exception_refcount(ptr) {
            if (!ptr) return;
            exception_decRef(new ExceptionInfo(ptr));
        }
        var exceptionLast = 0;
        function ___cxa_end_catch() {
            _setThrew(0);
            var info = exceptionCaught.pop();
            exception_decRef(info);
            exceptionLast = 0;
        }
        function ___resumeException(ptr) {
            if (!exceptionLast) {
                exceptionLast = ptr;
            }
            throw ptr;
        }
        function ___cxa_find_matching_catch_2() {
            var thrown = exceptionLast;
            if (!thrown) {
                setTempRet0(0);
                return 0;
            }
            var info = new ExceptionInfo(thrown);
            info.set_adjusted_ptr(thrown);
            var thrownType = info.get_type();
            if (!thrownType) {
                setTempRet0(0);
                return thrown;
            }
            for (var i = 0; i < arguments.length; i++) {
                var caughtType = arguments[i];
                if (caughtType === 0 || caughtType === thrownType) {
                    break;
                }
                var adjusted_ptr_addr = info.ptr + 16;
                if (
                    ___cxa_can_catch(caughtType, thrownType, adjusted_ptr_addr)
                ) {
                    setTempRet0(caughtType);
                    return thrown;
                }
            }
            setTempRet0(thrownType);
            return thrown;
        }
        function ___cxa_find_matching_catch_3() {
            var thrown = exceptionLast;
            if (!thrown) {
                setTempRet0(0);
                return 0;
            }
            var info = new ExceptionInfo(thrown);
            info.set_adjusted_ptr(thrown);
            var thrownType = info.get_type();
            if (!thrownType) {
                setTempRet0(0);
                return thrown;
            }
            for (var i = 0; i < arguments.length; i++) {
                var caughtType = arguments[i];
                if (caughtType === 0 || caughtType === thrownType) {
                    break;
                }
                var adjusted_ptr_addr = info.ptr + 16;
                if (
                    ___cxa_can_catch(caughtType, thrownType, adjusted_ptr_addr)
                ) {
                    setTempRet0(caughtType);
                    return thrown;
                }
            }
            setTempRet0(thrownType);
            return thrown;
        }
        function ___cxa_find_matching_catch_4() {
            var thrown = exceptionLast;
            if (!thrown) {
                setTempRet0(0);
                return 0;
            }
            var info = new ExceptionInfo(thrown);
            info.set_adjusted_ptr(thrown);
            var thrownType = info.get_type();
            if (!thrownType) {
                setTempRet0(0);
                return thrown;
            }
            for (var i = 0; i < arguments.length; i++) {
                var caughtType = arguments[i];
                if (caughtType === 0 || caughtType === thrownType) {
                    break;
                }
                var adjusted_ptr_addr = info.ptr + 16;
                if (
                    ___cxa_can_catch(caughtType, thrownType, adjusted_ptr_addr)
                ) {
                    setTempRet0(caughtType);
                    return thrown;
                }
            }
            setTempRet0(thrownType);
            return thrown;
        }
        function ___cxa_find_matching_catch_5() {
            var thrown = exceptionLast;
            if (!thrown) {
                setTempRet0(0);
                return 0;
            }
            var info = new ExceptionInfo(thrown);
            info.set_adjusted_ptr(thrown);
            var thrownType = info.get_type();
            if (!thrownType) {
                setTempRet0(0);
                return thrown;
            }
            for (var i = 0; i < arguments.length; i++) {
                var caughtType = arguments[i];
                if (caughtType === 0 || caughtType === thrownType) {
                    break;
                }
                var adjusted_ptr_addr = info.ptr + 16;
                if (
                    ___cxa_can_catch(caughtType, thrownType, adjusted_ptr_addr)
                ) {
                    setTempRet0(caughtType);
                    return thrown;
                }
            }
            setTempRet0(thrownType);
            return thrown;
        }
        function ___cxa_find_matching_catch_6() {
            var thrown = exceptionLast;
            if (!thrown) {
                setTempRet0(0);
                return 0;
            }
            var info = new ExceptionInfo(thrown);
            info.set_adjusted_ptr(thrown);
            var thrownType = info.get_type();
            if (!thrownType) {
                setTempRet0(0);
                return thrown;
            }
            for (var i = 0; i < arguments.length; i++) {
                var caughtType = arguments[i];
                if (caughtType === 0 || caughtType === thrownType) {
                    break;
                }
                var adjusted_ptr_addr = info.ptr + 16;
                if (
                    ___cxa_can_catch(caughtType, thrownType, adjusted_ptr_addr)
                ) {
                    setTempRet0(caughtType);
                    return thrown;
                }
            }
            setTempRet0(thrownType);
            return thrown;
        }
        function ___cxa_find_matching_catch_7() {
            var thrown = exceptionLast;
            if (!thrown) {
                setTempRet0(0);
                return 0;
            }
            var info = new ExceptionInfo(thrown);
            info.set_adjusted_ptr(thrown);
            var thrownType = info.get_type();
            if (!thrownType) {
                setTempRet0(0);
                return thrown;
            }
            for (var i = 0; i < arguments.length; i++) {
                var caughtType = arguments[i];
                if (caughtType === 0 || caughtType === thrownType) {
                    break;
                }
                var adjusted_ptr_addr = info.ptr + 16;
                if (
                    ___cxa_can_catch(caughtType, thrownType, adjusted_ptr_addr)
                ) {
                    setTempRet0(caughtType);
                    return thrown;
                }
            }
            setTempRet0(thrownType);
            return thrown;
        }
        function ___cxa_get_exception_ptr(ptr) {
            return new ExceptionInfo(ptr).get_exception_ptr();
        }
        function ___cxa_increment_exception_refcount(ptr) {
            if (!ptr) return;
            exception_addRef(new ExceptionInfo(ptr));
        }
        function ___cxa_rethrow() {
            var info = exceptionCaught.pop();
            if (!info) {
                abort('no exception to throw');
            }
            var ptr = info.excPtr;
            if (!info.get_rethrown()) {
                exceptionCaught.push(info);
                info.set_rethrown(true);
                info.set_caught(false);
                uncaughtExceptionCount++;
            }
            exceptionLast = ptr;
            throw ptr;
        }
        function ___cxa_rethrow_primary_exception(ptr) {
            if (!ptr) return;
            var info = new ExceptionInfo(ptr);
            exceptionCaught.push(info);
            info.set_rethrown(true);
            ___cxa_rethrow();
        }
        function ___cxa_throw(ptr, type, destructor) {
            var info = new ExceptionInfo(ptr);
            info.init(type, destructor);
            exceptionLast = ptr;
            uncaughtExceptionCount++;
            throw ptr;
        }
        function ___cxa_uncaught_exceptions() {
            return uncaughtExceptionCount;
        }
        var PATH = {
            isAbs: (path) => path.charAt(0) === '/',
            splitPath: (filename) => {
                var splitPathRe =
                    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
                return splitPathRe.exec(filename).slice(1);
            },
            normalizeArray: (parts, allowAboveRoot) => {
                var up = 0;
                for (var i = parts.length - 1; i >= 0; i--) {
                    var last = parts[i];
                    if (last === '.') {
                        parts.splice(i, 1);
                    } else if (last === '..') {
                        parts.splice(i, 1);
                        up++;
                    } else if (up) {
                        parts.splice(i, 1);
                        up--;
                    }
                }
                if (allowAboveRoot) {
                    for (; up; up--) {
                        parts.unshift('..');
                    }
                }
                return parts;
            },
            normalize: (path) => {
                var isAbsolute = PATH.isAbs(path),
                    trailingSlash = path.substr(-1) === '/';
                path = PATH.normalizeArray(
                    path.split('/').filter((p) => !!p),
                    !isAbsolute
                ).join('/');
                if (!path && !isAbsolute) {
                    path = '.';
                }
                if (path && trailingSlash) {
                    path += '/';
                }
                return (isAbsolute ? '/' : '') + path;
            },
            dirname: (path) => {
                var result = PATH.splitPath(path),
                    root = result[0],
                    dir = result[1];
                if (!root && !dir) {
                    return '.';
                }
                if (dir) {
                    dir = dir.substr(0, dir.length - 1);
                }
                return root + dir;
            },
            basename: (path) => {
                if (path === '/') return '/';
                path = PATH.normalize(path);
                path = path.replace(/\/$/, '');
                var lastSlash = path.lastIndexOf('/');
                if (lastSlash === -1) return path;
                return path.substr(lastSlash + 1);
            },
            join: function () {
                var paths = Array.prototype.slice.call(arguments);
                return PATH.normalize(paths.join('/'));
            },
            join2: (l, r) => {
                return PATH.normalize(l + '/' + r);
            },
        };
        function getRandomDevice() {
            if (
                typeof crypto == 'object' &&
                typeof crypto['getRandomValues'] == 'function'
            ) {
                var randomBuffer = new Uint8Array(1);
                return () => {
                    crypto.getRandomValues(randomBuffer);
                    return randomBuffer[0];
                };
            } else if (ENVIRONMENT_IS_NODE) {
                try {
                    var crypto_module = require('crypto');
                    return () => crypto_module['randomBytes'](1)[0];
                } catch (e) {}
            }
            return () => abort('randomDevice');
        }
        var PATH_FS = {
            resolve: function () {
                var resolvedPath = '',
                    resolvedAbsolute = false;
                for (
                    var i = arguments.length - 1;
                    i >= -1 && !resolvedAbsolute;
                    i--
                ) {
                    var path = i >= 0 ? arguments[i] : FS.cwd();
                    if (typeof path != 'string') {
                        throw new TypeError(
                            'Arguments to path.resolve must be strings'
                        );
                    } else if (!path) {
                        return '';
                    }
                    resolvedPath = path + '/' + resolvedPath;
                    resolvedAbsolute = PATH.isAbs(path);
                }
                resolvedPath = PATH.normalizeArray(
                    resolvedPath.split('/').filter((p) => !!p),
                    !resolvedAbsolute
                ).join('/');
                return (resolvedAbsolute ? '/' : '') + resolvedPath || '.';
            },
            relative: (from, to) => {
                from = PATH_FS.resolve(from).substr(1);
                to = PATH_FS.resolve(to).substr(1);
                function trim(arr) {
                    var start = 0;
                    for (; start < arr.length; start++) {
                        if (arr[start] !== '') break;
                    }
                    var end = arr.length - 1;
                    for (; end >= 0; end--) {
                        if (arr[end] !== '') break;
                    }
                    if (start > end) return [];
                    return arr.slice(start, end - start + 1);
                }
                var fromParts = trim(from.split('/'));
                var toParts = trim(to.split('/'));
                var length = Math.min(fromParts.length, toParts.length);
                var samePartsLength = length;
                for (var i = 0; i < length; i++) {
                    if (fromParts[i] !== toParts[i]) {
                        samePartsLength = i;
                        break;
                    }
                }
                var outputParts = [];
                for (var i = samePartsLength; i < fromParts.length; i++) {
                    outputParts.push('..');
                }
                outputParts = outputParts.concat(
                    toParts.slice(samePartsLength)
                );
                return outputParts.join('/');
            },
        };
        function intArrayFromString(stringy, dontAddNull, length) {
            var len = length > 0 ? length : lengthBytesUTF8(stringy) + 1;
            var u8array = new Array(len);
            var numBytesWritten = stringToUTF8Array(
                stringy,
                u8array,
                0,
                u8array.length
            );
            if (dontAddNull) u8array.length = numBytesWritten;
            return u8array;
        }
        var TTY = {
            ttys: [],
            init: function () {},
            shutdown: function () {},
            register: function (dev, ops) {
                TTY.ttys[dev] = { input: [], output: [], ops: ops };
                FS.registerDevice(dev, TTY.stream_ops);
            },
            stream_ops: {
                open: function (stream) {
                    var tty = TTY.ttys[stream.node.rdev];
                    if (!tty) {
                        throw new FS.ErrnoError(43);
                    }
                    stream.tty = tty;
                    stream.seekable = false;
                },
                close: function (stream) {
                    stream.tty.ops.fsync(stream.tty);
                },
                fsync: function (stream) {
                    stream.tty.ops.fsync(stream.tty);
                },
                read: function (stream, buffer, offset, length, pos) {
                    if (!stream.tty || !stream.tty.ops.get_char) {
                        throw new FS.ErrnoError(60);
                    }
                    var bytesRead = 0;
                    for (var i = 0; i < length; i++) {
                        var result;
                        try {
                            result = stream.tty.ops.get_char(stream.tty);
                        } catch (e) {
                            throw new FS.ErrnoError(29);
                        }
                        if (result === undefined && bytesRead === 0) {
                            throw new FS.ErrnoError(6);
                        }
                        if (result === null || result === undefined) break;
                        bytesRead++;
                        buffer[offset + i] = result;
                    }
                    if (bytesRead) {
                        stream.node.timestamp = Date.now();
                    }
                    return bytesRead;
                },
                write: function (stream, buffer, offset, length, pos) {
                    if (!stream.tty || !stream.tty.ops.put_char) {
                        throw new FS.ErrnoError(60);
                    }
                    try {
                        for (var i = 0; i < length; i++) {
                            stream.tty.ops.put_char(
                                stream.tty,
                                buffer[offset + i]
                            );
                        }
                    } catch (e) {
                        throw new FS.ErrnoError(29);
                    }
                    if (length) {
                        stream.node.timestamp = Date.now();
                    }
                    return i;
                },
            },
            default_tty_ops: {
                get_char: function (tty) {
                    if (!tty.input.length) {
                        var result = null;
                        if (ENVIRONMENT_IS_NODE) {
                            var BUFSIZE = 256;
                            var buf = Buffer.alloc(BUFSIZE);
                            var bytesRead = 0;
                            try {
                                bytesRead = fs.readSync(
                                    process.stdin.fd,
                                    buf,
                                    0,
                                    BUFSIZE,
                                    -1
                                );
                            } catch (e) {
                                if (e.toString().includes('EOF')) bytesRead = 0;
                                else throw e;
                            }
                            if (bytesRead > 0) {
                                result = buf
                                    .slice(0, bytesRead)
                                    .toString('utf-8');
                            } else {
                                result = null;
                            }
                        } else if (
                            typeof window != 'undefined' &&
                            typeof window.prompt == 'function'
                        ) {
                            result = window.prompt('Input: ');
                            if (result !== null) {
                                result += '\n';
                            }
                        } else if (typeof readline == 'function') {
                            result = readline();
                            if (result !== null) {
                                result += '\n';
                            }
                        }
                        if (!result) {
                            return null;
                        }
                        tty.input = intArrayFromString(result, true);
                    }
                    return tty.input.shift();
                },
                put_char: function (tty, val) {
                    if (val === null || val === 10) {
                        out(UTF8ArrayToString(tty.output, 0));
                        tty.output = [];
                    } else {
                        if (val != 0) tty.output.push(val);
                    }
                },
                fsync: function (tty) {
                    if (tty.output && tty.output.length > 0) {
                        out(UTF8ArrayToString(tty.output, 0));
                        tty.output = [];
                    }
                },
            },
            default_tty1_ops: {
                put_char: function (tty, val) {
                    if (val === null || val === 10) {
                        err(UTF8ArrayToString(tty.output, 0));
                        tty.output = [];
                    } else {
                        if (val != 0) tty.output.push(val);
                    }
                },
                fsync: function (tty) {
                    if (tty.output && tty.output.length > 0) {
                        err(UTF8ArrayToString(tty.output, 0));
                        tty.output = [];
                    }
                },
            },
        };
        function mmapAlloc(size) {
            abort();
        }
        var MEMFS = {
            ops_table: null,
            mount: function (mount) {
                return MEMFS.createNode(null, '/', 16384 | 511, 0);
            },
            createNode: function (parent, name, mode, dev) {
                if (FS.isBlkdev(mode) || FS.isFIFO(mode)) {
                    throw new FS.ErrnoError(63);
                }
                if (!MEMFS.ops_table) {
                    MEMFS.ops_table = {
                        dir: {
                            node: {
                                getattr: MEMFS.node_ops.getattr,
                                setattr: MEMFS.node_ops.setattr,
                                lookup: MEMFS.node_ops.lookup,
                                mknod: MEMFS.node_ops.mknod,
                                rename: MEMFS.node_ops.rename,
                                unlink: MEMFS.node_ops.unlink,
                                rmdir: MEMFS.node_ops.rmdir,
                                readdir: MEMFS.node_ops.readdir,
                                symlink: MEMFS.node_ops.symlink,
                            },
                            stream: { llseek: MEMFS.stream_ops.llseek },
                        },
                        file: {
                            node: {
                                getattr: MEMFS.node_ops.getattr,
                                setattr: MEMFS.node_ops.setattr,
                            },
                            stream: {
                                llseek: MEMFS.stream_ops.llseek,
                                read: MEMFS.stream_ops.read,
                                write: MEMFS.stream_ops.write,
                                allocate: MEMFS.stream_ops.allocate,
                                mmap: MEMFS.stream_ops.mmap,
                                msync: MEMFS.stream_ops.msync,
                            },
                        },
                        link: {
                            node: {
                                getattr: MEMFS.node_ops.getattr,
                                setattr: MEMFS.node_ops.setattr,
                                readlink: MEMFS.node_ops.readlink,
                            },
                            stream: {},
                        },
                        chrdev: {
                            node: {
                                getattr: MEMFS.node_ops.getattr,
                                setattr: MEMFS.node_ops.setattr,
                            },
                            stream: FS.chrdev_stream_ops,
                        },
                    };
                }
                var node = FS.createNode(parent, name, mode, dev);
                if (FS.isDir(node.mode)) {
                    node.node_ops = MEMFS.ops_table.dir.node;
                    node.stream_ops = MEMFS.ops_table.dir.stream;
                    node.contents = {};
                } else if (FS.isFile(node.mode)) {
                    node.node_ops = MEMFS.ops_table.file.node;
                    node.stream_ops = MEMFS.ops_table.file.stream;
                    node.usedBytes = 0;
                    node.contents = null;
                } else if (FS.isLink(node.mode)) {
                    node.node_ops = MEMFS.ops_table.link.node;
                    node.stream_ops = MEMFS.ops_table.link.stream;
                } else if (FS.isChrdev(node.mode)) {
                    node.node_ops = MEMFS.ops_table.chrdev.node;
                    node.stream_ops = MEMFS.ops_table.chrdev.stream;
                }
                node.timestamp = Date.now();
                if (parent) {
                    parent.contents[name] = node;
                    parent.timestamp = node.timestamp;
                }
                return node;
            },
            getFileDataAsTypedArray: function (node) {
                if (!node.contents) return new Uint8Array(0);
                if (node.contents.subarray)
                    return node.contents.subarray(0, node.usedBytes);
                return new Uint8Array(node.contents);
            },
            expandFileStorage: function (node, newCapacity) {
                var prevCapacity = node.contents ? node.contents.length : 0;
                if (prevCapacity >= newCapacity) return;
                var CAPACITY_DOUBLING_MAX = 1024 * 1024;
                newCapacity = Math.max(
                    newCapacity,
                    (prevCapacity *
                        (prevCapacity < CAPACITY_DOUBLING_MAX ? 2 : 1.125)) >>>
                        0
                );
                if (prevCapacity != 0) newCapacity = Math.max(newCapacity, 256);
                var oldContents = node.contents;
                node.contents = new Uint8Array(newCapacity);
                if (node.usedBytes > 0)
                    node.contents.set(
                        oldContents.subarray(0, node.usedBytes),
                        0
                    );
            },
            resizeFileStorage: function (node, newSize) {
                if (node.usedBytes == newSize) return;
                if (newSize == 0) {
                    node.contents = null;
                    node.usedBytes = 0;
                } else {
                    var oldContents = node.contents;
                    node.contents = new Uint8Array(newSize);
                    if (oldContents) {
                        node.contents.set(
                            oldContents.subarray(
                                0,
                                Math.min(newSize, node.usedBytes)
                            )
                        );
                    }
                    node.usedBytes = newSize;
                }
            },
            node_ops: {
                getattr: function (node) {
                    var attr = {};
                    attr.dev = FS.isChrdev(node.mode) ? node.id : 1;
                    attr.ino = node.id;
                    attr.mode = node.mode;
                    attr.nlink = 1;
                    attr.uid = 0;
                    attr.gid = 0;
                    attr.rdev = node.rdev;
                    if (FS.isDir(node.mode)) {
                        attr.size = 4096;
                    } else if (FS.isFile(node.mode)) {
                        attr.size = node.usedBytes;
                    } else if (FS.isLink(node.mode)) {
                        attr.size = node.link.length;
                    } else {
                        attr.size = 0;
                    }
                    attr.atime = new Date(node.timestamp);
                    attr.mtime = new Date(node.timestamp);
                    attr.ctime = new Date(node.timestamp);
                    attr.blksize = 4096;
                    attr.blocks = Math.ceil(attr.size / attr.blksize);
                    return attr;
                },
                setattr: function (node, attr) {
                    if (attr.mode !== undefined) {
                        node.mode = attr.mode;
                    }
                    if (attr.timestamp !== undefined) {
                        node.timestamp = attr.timestamp;
                    }
                    if (attr.size !== undefined) {
                        MEMFS.resizeFileStorage(node, attr.size);
                    }
                },
                lookup: function (parent, name) {
                    throw FS.genericErrors[44];
                },
                mknod: function (parent, name, mode, dev) {
                    return MEMFS.createNode(parent, name, mode, dev);
                },
                rename: function (old_node, new_dir, new_name) {
                    if (FS.isDir(old_node.mode)) {
                        var new_node;
                        try {
                            new_node = FS.lookupNode(new_dir, new_name);
                        } catch (e) {}
                        if (new_node) {
                            for (var i in new_node.contents) {
                                throw new FS.ErrnoError(55);
                            }
                        }
                    }
                    delete old_node.parent.contents[old_node.name];
                    old_node.parent.timestamp = Date.now();
                    old_node.name = new_name;
                    new_dir.contents[new_name] = old_node;
                    new_dir.timestamp = old_node.parent.timestamp;
                    old_node.parent = new_dir;
                },
                unlink: function (parent, name) {
                    delete parent.contents[name];
                    parent.timestamp = Date.now();
                },
                rmdir: function (parent, name) {
                    var node = FS.lookupNode(parent, name);
                    for (var i in node.contents) {
                        throw new FS.ErrnoError(55);
                    }
                    delete parent.contents[name];
                    parent.timestamp = Date.now();
                },
                readdir: function (node) {
                    var entries = ['.', '..'];
                    for (var key in node.contents) {
                        if (!node.contents.hasOwnProperty(key)) {
                            continue;
                        }
                        entries.push(key);
                    }
                    return entries;
                },
                symlink: function (parent, newname, oldpath) {
                    var node = MEMFS.createNode(
                        parent,
                        newname,
                        511 | 40960,
                        0
                    );
                    node.link = oldpath;
                    return node;
                },
                readlink: function (node) {
                    if (!FS.isLink(node.mode)) {
                        throw new FS.ErrnoError(28);
                    }
                    return node.link;
                },
            },
            stream_ops: {
                read: function (stream, buffer, offset, length, position) {
                    var contents = stream.node.contents;
                    if (position >= stream.node.usedBytes) return 0;
                    var size = Math.min(
                        stream.node.usedBytes - position,
                        length
                    );
                    if (size > 8 && contents.subarray) {
                        buffer.set(
                            contents.subarray(position, position + size),
                            offset
                        );
                    } else {
                        for (var i = 0; i < size; i++)
                            buffer[offset + i] = contents[position + i];
                    }
                    return size;
                },
                write: function (
                    stream,
                    buffer,
                    offset,
                    length,
                    position,
                    canOwn
                ) {
                    if (buffer.buffer === HEAP8.buffer) {
                        canOwn = false;
                    }
                    if (!length) return 0;
                    var node = stream.node;
                    node.timestamp = Date.now();
                    if (
                        buffer.subarray &&
                        (!node.contents || node.contents.subarray)
                    ) {
                        if (canOwn) {
                            node.contents = buffer.subarray(
                                offset,
                                offset + length
                            );
                            node.usedBytes = length;
                            return length;
                        } else if (node.usedBytes === 0 && position === 0) {
                            node.contents = buffer.slice(
                                offset,
                                offset + length
                            );
                            node.usedBytes = length;
                            return length;
                        } else if (position + length <= node.usedBytes) {
                            node.contents.set(
                                buffer.subarray(offset, offset + length),
                                position
                            );
                            return length;
                        }
                    }
                    MEMFS.expandFileStorage(node, position + length);
                    if (node.contents.subarray && buffer.subarray) {
                        node.contents.set(
                            buffer.subarray(offset, offset + length),
                            position
                        );
                    } else {
                        for (var i = 0; i < length; i++) {
                            node.contents[position + i] = buffer[offset + i];
                        }
                    }
                    node.usedBytes = Math.max(
                        node.usedBytes,
                        position + length
                    );
                    return length;
                },
                llseek: function (stream, offset, whence) {
                    var position = offset;
                    if (whence === 1) {
                        position += stream.position;
                    } else if (whence === 2) {
                        if (FS.isFile(stream.node.mode)) {
                            position += stream.node.usedBytes;
                        }
                    }
                    if (position < 0) {
                        throw new FS.ErrnoError(28);
                    }
                    return position;
                },
                allocate: function (stream, offset, length) {
                    MEMFS.expandFileStorage(stream.node, offset + length);
                    stream.node.usedBytes = Math.max(
                        stream.node.usedBytes,
                        offset + length
                    );
                },
                mmap: function (stream, length, position, prot, flags) {
                    if (!FS.isFile(stream.node.mode)) {
                        throw new FS.ErrnoError(43);
                    }
                    var ptr;
                    var allocated;
                    var contents = stream.node.contents;
                    if (!(flags & 2) && contents.buffer === buffer) {
                        allocated = false;
                        ptr = contents.byteOffset;
                    } else {
                        if (
                            position > 0 ||
                            position + length < contents.length
                        ) {
                            if (contents.subarray) {
                                contents = contents.subarray(
                                    position,
                                    position + length
                                );
                            } else {
                                contents = Array.prototype.slice.call(
                                    contents,
                                    position,
                                    position + length
                                );
                            }
                        }
                        allocated = true;
                        ptr = mmapAlloc(length);
                        if (!ptr) {
                            throw new FS.ErrnoError(48);
                        }
                        HEAP8.set(contents, ptr);
                    }
                    return { ptr: ptr, allocated: allocated };
                },
                msync: function (stream, buffer, offset, length, mmapFlags) {
                    MEMFS.stream_ops.write(
                        stream,
                        buffer,
                        0,
                        length,
                        offset,
                        false
                    );
                    return 0;
                },
            },
        };
        function asyncLoad(url, onload, onerror, noRunDep) {
            var dep = !noRunDep ? getUniqueRunDependency('al ' + url) : '';
            readAsync(
                url,
                (arrayBuffer) => {
                    assert(
                        arrayBuffer,
                        'Loading data file "' +
                            url +
                            '" failed (no arrayBuffer).'
                    );
                    onload(new Uint8Array(arrayBuffer));
                    if (dep) removeRunDependency(dep);
                },
                (event) => {
                    if (onerror) {
                        onerror();
                    } else {
                        throw 'Loading data file "' + url + '" failed.';
                    }
                }
            );
            if (dep) addRunDependency(dep);
        }
        var LZ4 = {
            DIR_MODE: 16895,
            FILE_MODE: 33279,
            CHUNK_SIZE: -1,
            codec: null,
            init: function () {
                if (LZ4.codec) return;
                LZ4.codec = (function () {
                    var MiniLZ4 = (function () {
                        var exports = {};
                        exports.uncompress = function (
                            input,
                            output,
                            sIdx,
                            eIdx
                        ) {
                            sIdx = sIdx || 0;
                            eIdx = eIdx || input.length - sIdx;
                            for (var i = sIdx, n = eIdx, j = 0; i < n; ) {
                                var token = input[i++];
                                var literals_length = token >> 4;
                                if (literals_length > 0) {
                                    var l = literals_length + 240;
                                    while (l === 255) {
                                        l = input[i++];
                                        literals_length += l;
                                    }
                                    var end = i + literals_length;
                                    while (i < end) output[j++] = input[i++];
                                    if (i === n) return j;
                                }
                                var offset = input[i++] | (input[i++] << 8);
                                if (offset === 0) return j;
                                if (offset > j) return -(i - 2);
                                var match_length = token & 15;
                                var l = match_length + 240;
                                while (l === 255) {
                                    l = input[i++];
                                    match_length += l;
                                }
                                var pos = j - offset;
                                var end = j + match_length + 4;
                                while (j < end) output[j++] = output[pos++];
                            }
                            return j;
                        };
                        var maxInputSize = 2113929216,
                            minMatch = 4,
                            hashLog = 16,
                            hashShift = minMatch * 8 - hashLog,
                            copyLength = 8,
                            mfLimit = copyLength + minMatch,
                            skipStrength = 6,
                            mlBits = 4,
                            mlMask = (1 << mlBits) - 1,
                            runBits = 8 - mlBits,
                            runMask = (1 << runBits) - 1,
                            hasher = 2654435761;
                        assert(hashShift === 16);
                        var hashTable = new Int16Array(1 << 16);
                        var empty = new Int16Array(hashTable.length);
                        exports.compressBound = function (isize) {
                            return isize > maxInputSize
                                ? 0
                                : (isize + isize / 255 + 16) | 0;
                        };
                        exports.compress = function (src, dst, sIdx, eIdx) {
                            hashTable.set(empty);
                            return compressBlock(
                                src,
                                dst,
                                0,
                                sIdx || 0,
                                eIdx || dst.length
                            );
                        };
                        function compressBlock(src, dst, pos, sIdx, eIdx) {
                            var dpos = sIdx;
                            var dlen = eIdx - sIdx;
                            var anchor = 0;
                            if (src.length >= maxInputSize)
                                throw new Error('input too large');
                            if (src.length > mfLimit) {
                                var n = exports.compressBound(src.length);
                                if (dlen < n)
                                    throw Error(
                                        'output too small: ' + dlen + ' < ' + n
                                    );
                                var step = 1,
                                    findMatchAttempts = (1 << skipStrength) + 3,
                                    srcLength = src.length - mfLimit;
                                while (pos + minMatch < srcLength) {
                                    var sequenceLowBits =
                                        (src[pos + 1] << 8) | src[pos];
                                    var sequenceHighBits =
                                        (src[pos + 3] << 8) | src[pos + 2];
                                    var hash =
                                        Math.imul(
                                            sequenceLowBits |
                                                (sequenceHighBits << 16),
                                            hasher
                                        ) >>> hashShift;
                                    var ref = hashTable[hash] - 1;
                                    hashTable[hash] = pos + 1;
                                    if (
                                        ref < 0 ||
                                        (pos - ref) >>> 16 > 0 ||
                                        ((src[ref + 3] << 8) | src[ref + 2]) !=
                                            sequenceHighBits ||
                                        ((src[ref + 1] << 8) | src[ref]) !=
                                            sequenceLowBits
                                    ) {
                                        step =
                                            findMatchAttempts++ >> skipStrength;
                                        pos += step;
                                        continue;
                                    }
                                    findMatchAttempts = (1 << skipStrength) + 3;
                                    var literals_length = pos - anchor;
                                    var offset = pos - ref;
                                    pos += minMatch;
                                    ref += minMatch;
                                    var match_length = pos;
                                    while (
                                        pos < srcLength &&
                                        src[pos] == src[ref]
                                    ) {
                                        pos++;
                                        ref++;
                                    }
                                    match_length = pos - match_length;
                                    var token =
                                        match_length < mlMask
                                            ? match_length
                                            : mlMask;
                                    if (literals_length >= runMask) {
                                        dst[dpos++] =
                                            (runMask << mlBits) + token;
                                        for (
                                            var len = literals_length - runMask;
                                            len > 254;
                                            len -= 255
                                        ) {
                                            dst[dpos++] = 255;
                                        }
                                        dst[dpos++] = len;
                                    } else {
                                        dst[dpos++] =
                                            (literals_length << mlBits) + token;
                                    }
                                    for (var i = 0; i < literals_length; i++) {
                                        dst[dpos++] = src[anchor + i];
                                    }
                                    dst[dpos++] = offset;
                                    dst[dpos++] = offset >> 8;
                                    if (match_length >= mlMask) {
                                        match_length -= mlMask;
                                        while (match_length >= 255) {
                                            match_length -= 255;
                                            dst[dpos++] = 255;
                                        }
                                        dst[dpos++] = match_length;
                                    }
                                    anchor = pos;
                                }
                            }
                            if (anchor == 0) return 0;
                            literals_length = src.length - anchor;
                            if (literals_length >= runMask) {
                                dst[dpos++] = runMask << mlBits;
                                for (
                                    var ln = literals_length - runMask;
                                    ln > 254;
                                    ln -= 255
                                ) {
                                    dst[dpos++] = 255;
                                }
                                dst[dpos++] = ln;
                            } else {
                                dst[dpos++] = literals_length << mlBits;
                            }
                            pos = anchor;
                            while (pos < src.length) {
                                dst[dpos++] = src[pos++];
                            }
                            return dpos;
                        }
                        exports.CHUNK_SIZE = 2048;
                        exports.compressPackage = function (data, verify) {
                            if (verify) {
                                var temp = new Uint8Array(exports.CHUNK_SIZE);
                            }
                            assert(data instanceof ArrayBuffer);
                            data = new Uint8Array(data);
                            console.log(
                                'compressing package of size ' + data.length
                            );
                            var compressedChunks = [];
                            var successes = [];
                            var offset = 0;
                            var total = 0;
                            while (offset < data.length) {
                                var chunk = data.subarray(
                                    offset,
                                    offset + exports.CHUNK_SIZE
                                );
                                offset += exports.CHUNK_SIZE;
                                var bound = exports.compressBound(chunk.length);
                                var compressed = new Uint8Array(bound);
                                var compressedSize = exports.compress(
                                    chunk,
                                    compressed
                                );
                                if (compressedSize > 0) {
                                    assert(compressedSize <= bound);
                                    compressed = compressed.subarray(
                                        0,
                                        compressedSize
                                    );
                                    compressedChunks.push(compressed);
                                    total += compressedSize;
                                    successes.push(1);
                                    if (verify) {
                                        var back = exports.uncompress(
                                            compressed,
                                            temp
                                        );
                                        assert(back === chunk.length, [
                                            back,
                                            chunk.length,
                                        ]);
                                        for (var i = 0; i < chunk.length; i++) {
                                            assert(chunk[i] === temp[i]);
                                        }
                                    }
                                } else {
                                    assert(compressedSize === 0);
                                    compressedChunks.push(chunk);
                                    total += chunk.length;
                                    successes.push(0);
                                }
                            }
                            data = null;
                            var compressedData = {
                                data: new Uint8Array(
                                    total + exports.CHUNK_SIZE * 2
                                ),
                                cachedOffset: total,
                                cachedIndexes: [-1, -1],
                                cachedChunks: [null, null],
                                offsets: [],
                                sizes: [],
                                successes: successes,
                            };
                            offset = 0;
                            for (var i = 0; i < compressedChunks.length; i++) {
                                compressedData['data'].set(
                                    compressedChunks[i],
                                    offset
                                );
                                compressedData['offsets'][i] = offset;
                                compressedData['sizes'][i] =
                                    compressedChunks[i].length;
                                offset += compressedChunks[i].length;
                            }
                            console.log(
                                'compressed package into ' +
                                    [compressedData['data'].length]
                            );
                            assert(offset === total);
                            return compressedData;
                        };
                        assert(exports.CHUNK_SIZE < 1 << 15);
                        return exports;
                    })();
                    return MiniLZ4;
                })();
                LZ4.CHUNK_SIZE = LZ4.codec.CHUNK_SIZE;
            },
            loadPackage: function (pack, preloadPlugin) {
                LZ4.init();
                var compressedData = pack['compressedData'];
                if (!compressedData)
                    compressedData = LZ4.codec.compressPackage(pack['data']);
                assert(
                    compressedData['cachedIndexes'].length ===
                        compressedData['cachedChunks'].length
                );
                for (
                    var i = 0;
                    i < compressedData['cachedIndexes'].length;
                    i++
                ) {
                    compressedData['cachedIndexes'][i] = -1;
                    compressedData['cachedChunks'][i] = compressedData[
                        'data'
                    ].subarray(
                        compressedData['cachedOffset'] + i * LZ4.CHUNK_SIZE,
                        compressedData['cachedOffset'] +
                            (i + 1) * LZ4.CHUNK_SIZE
                    );
                    assert(
                        compressedData['cachedChunks'][i].length ===
                            LZ4.CHUNK_SIZE
                    );
                }
                pack['metadata'].files.forEach(function (file) {
                    var dir = PATH.dirname(file.filename);
                    var name = PATH.basename(file.filename);
                    FS.createPath('', dir, true, true);
                    var parent = FS.analyzePath(dir).object;
                    LZ4.createNode(parent, name, LZ4.FILE_MODE, 0, {
                        compressedData: compressedData,
                        start: file.start,
                        end: file.end,
                    });
                });
                if (preloadPlugin) {
                    Browser.init();
                    pack['metadata'].files.forEach(function (file) {
                        var handled = false;
                        var fullname = file.filename;
                        Module['preloadPlugins'].forEach(function (plugin) {
                            if (handled) return;
                            if (plugin['canHandle'](fullname)) {
                                var dep = getUniqueRunDependency(
                                    'fp ' + fullname
                                );
                                addRunDependency(dep);
                                var finish = function () {
                                    removeRunDependency(dep);
                                };
                                var byteArray = FS.readFile(fullname);
                                plugin['handle'](
                                    byteArray,
                                    fullname,
                                    finish,
                                    finish
                                );
                                handled = true;
                            }
                        });
                    });
                }
            },
            createNode: function (parent, name, mode, dev, contents, mtime) {
                var node = FS.createNode(parent, name, mode);
                node.mode = mode;
                node.node_ops = LZ4.node_ops;
                node.stream_ops = LZ4.stream_ops;
                node.timestamp = (mtime || new Date()).getTime();
                assert(LZ4.FILE_MODE !== LZ4.DIR_MODE);
                if (mode === LZ4.FILE_MODE) {
                    node.size = contents.end - contents.start;
                    node.contents = contents;
                } else {
                    node.size = 4096;
                    node.contents = {};
                }
                if (parent) {
                    parent.contents[name] = node;
                }
                return node;
            },
            node_ops: {
                getattr: function (node) {
                    return {
                        dev: 1,
                        ino: node.id,
                        mode: node.mode,
                        nlink: 1,
                        uid: 0,
                        gid: 0,
                        rdev: undefined,
                        size: node.size,
                        atime: new Date(node.timestamp),
                        mtime: new Date(node.timestamp),
                        ctime: new Date(node.timestamp),
                        blksize: 4096,
                        blocks: Math.ceil(node.size / 4096),
                    };
                },
                setattr: function (node, attr) {
                    if (attr.mode !== undefined) {
                        node.mode = attr.mode;
                    }
                    if (attr.timestamp !== undefined) {
                        node.timestamp = attr.timestamp;
                    }
                },
                lookup: function (parent, name) {
                    throw new FS.ErrnoError(44);
                },
                mknod: function (parent, name, mode, dev) {
                    throw new FS.ErrnoError(63);
                },
                rename: function (oldNode, newDir, newName) {
                    throw new FS.ErrnoError(63);
                },
                unlink: function (parent, name) {
                    throw new FS.ErrnoError(63);
                },
                rmdir: function (parent, name) {
                    throw new FS.ErrnoError(63);
                },
                readdir: function (node) {
                    throw new FS.ErrnoError(63);
                },
                symlink: function (parent, newName, oldPath) {
                    throw new FS.ErrnoError(63);
                },
                readlink: function (node) {
                    throw new FS.ErrnoError(63);
                },
            },
            stream_ops: {
                read: function (stream, buffer, offset, length, position) {
                    length = Math.min(length, stream.node.size - position);
                    if (length <= 0) return 0;
                    var contents = stream.node.contents;
                    var compressedData = contents.compressedData;
                    var written = 0;
                    while (written < length) {
                        var start = contents.start + position + written;
                        var desired = length - written;
                        var chunkIndex = Math.floor(start / LZ4.CHUNK_SIZE);
                        var compressedStart =
                            compressedData['offsets'][chunkIndex];
                        var compressedSize =
                            compressedData['sizes'][chunkIndex];
                        var currChunk;
                        if (compressedData['successes'][chunkIndex]) {
                            var found =
                                compressedData['cachedIndexes'].indexOf(
                                    chunkIndex
                                );
                            if (found >= 0) {
                                currChunk =
                                    compressedData['cachedChunks'][found];
                            } else {
                                compressedData['cachedIndexes'].pop();
                                compressedData['cachedIndexes'].unshift(
                                    chunkIndex
                                );
                                currChunk =
                                    compressedData['cachedChunks'].pop();
                                compressedData['cachedChunks'].unshift(
                                    currChunk
                                );
                                if (compressedData['debug']) {
                                    out('decompressing chunk ' + chunkIndex);
                                    Module['decompressedChunks'] =
                                        (Module['decompressedChunks'] || 0) + 1;
                                }
                                var compressed = compressedData[
                                    'data'
                                ].subarray(
                                    compressedStart,
                                    compressedStart + compressedSize
                                );
                                var originalSize = LZ4.codec.uncompress(
                                    compressed,
                                    currChunk
                                );
                                if (
                                    chunkIndex <
                                    compressedData['successes'].length - 1
                                )
                                    assert(originalSize === LZ4.CHUNK_SIZE);
                            }
                        } else {
                            currChunk = compressedData['data'].subarray(
                                compressedStart,
                                compressedStart + LZ4.CHUNK_SIZE
                            );
                        }
                        var startInChunk = start % LZ4.CHUNK_SIZE;
                        var endInChunk = Math.min(
                            startInChunk + desired,
                            LZ4.CHUNK_SIZE
                        );
                        buffer.set(
                            currChunk.subarray(startInChunk, endInChunk),
                            offset + written
                        );
                        var currWritten = endInChunk - startInChunk;
                        written += currWritten;
                    }
                    return written;
                },
                write: function (stream, buffer, offset, length, position) {
                    throw new FS.ErrnoError(29);
                },
                llseek: function (stream, offset, whence) {
                    var position = offset;
                    if (whence === 1) {
                        position += stream.position;
                    } else if (whence === 2) {
                        if (FS.isFile(stream.node.mode)) {
                            position += stream.node.size;
                        }
                    }
                    if (position < 0) {
                        throw new FS.ErrnoError(28);
                    }
                    return position;
                },
            },
        };
        var FS = {
            root: null,
            mounts: [],
            devices: {},
            streams: [],
            nextInode: 1,
            nameTable: null,
            currentPath: '/',
            initialized: false,
            ignorePermissions: true,
            ErrnoError: null,
            genericErrors: {},
            filesystems: null,
            syncFSRequests: 0,
            lookupPath: (path, opts = {}) => {
                path = PATH_FS.resolve(FS.cwd(), path);
                if (!path) return { path: '', node: null };
                var defaults = { follow_mount: true, recurse_count: 0 };
                opts = Object.assign(defaults, opts);
                if (opts.recurse_count > 8) {
                    throw new FS.ErrnoError(32);
                }
                var parts = PATH.normalizeArray(
                    path.split('/').filter((p) => !!p),
                    false
                );
                var current = FS.root;
                var current_path = '/';
                for (var i = 0; i < parts.length; i++) {
                    var islast = i === parts.length - 1;
                    if (islast && opts.parent) {
                        break;
                    }
                    current = FS.lookupNode(current, parts[i]);
                    current_path = PATH.join2(current_path, parts[i]);
                    if (FS.isMountpoint(current)) {
                        if (!islast || (islast && opts.follow_mount)) {
                            current = current.mounted.root;
                        }
                    }
                    if (!islast || opts.follow) {
                        var count = 0;
                        while (FS.isLink(current.mode)) {
                            var link = FS.readlink(current_path);
                            current_path = PATH_FS.resolve(
                                PATH.dirname(current_path),
                                link
                            );
                            var lookup = FS.lookupPath(current_path, {
                                recurse_count: opts.recurse_count + 1,
                            });
                            current = lookup.node;
                            if (count++ > 40) {
                                throw new FS.ErrnoError(32);
                            }
                        }
                    }
                }
                return { path: current_path, node: current };
            },
            getPath: (node) => {
                var path;
                while (true) {
                    if (FS.isRoot(node)) {
                        var mount = node.mount.mountpoint;
                        if (!path) return mount;
                        return mount[mount.length - 1] !== '/'
                            ? mount + '/' + path
                            : mount + path;
                    }
                    path = path ? node.name + '/' + path : node.name;
                    node = node.parent;
                }
            },
            hashName: (parentid, name) => {
                var hash = 0;
                for (var i = 0; i < name.length; i++) {
                    hash = ((hash << 5) - hash + name.charCodeAt(i)) | 0;
                }
                return ((parentid + hash) >>> 0) % FS.nameTable.length;
            },
            hashAddNode: (node) => {
                var hash = FS.hashName(node.parent.id, node.name);
                node.name_next = FS.nameTable[hash];
                FS.nameTable[hash] = node;
            },
            hashRemoveNode: (node) => {
                var hash = FS.hashName(node.parent.id, node.name);
                if (FS.nameTable[hash] === node) {
                    FS.nameTable[hash] = node.name_next;
                } else {
                    var current = FS.nameTable[hash];
                    while (current) {
                        if (current.name_next === node) {
                            current.name_next = node.name_next;
                            break;
                        }
                        current = current.name_next;
                    }
                }
            },
            lookupNode: (parent, name) => {
                var errCode = FS.mayLookup(parent);
                if (errCode) {
                    throw new FS.ErrnoError(errCode, parent);
                }
                var hash = FS.hashName(parent.id, name);
                for (
                    var node = FS.nameTable[hash];
                    node;
                    node = node.name_next
                ) {
                    var nodeName = node.name;
                    if (node.parent.id === parent.id && nodeName === name) {
                        return node;
                    }
                }
                return FS.lookup(parent, name);
            },
            createNode: (parent, name, mode, rdev) => {
                var node = new FS.FSNode(parent, name, mode, rdev);
                FS.hashAddNode(node);
                return node;
            },
            destroyNode: (node) => {
                FS.hashRemoveNode(node);
            },
            isRoot: (node) => {
                return node === node.parent;
            },
            isMountpoint: (node) => {
                return !!node.mounted;
            },
            isFile: (mode) => {
                return (mode & 61440) === 32768;
            },
            isDir: (mode) => {
                return (mode & 61440) === 16384;
            },
            isLink: (mode) => {
                return (mode & 61440) === 40960;
            },
            isChrdev: (mode) => {
                return (mode & 61440) === 8192;
            },
            isBlkdev: (mode) => {
                return (mode & 61440) === 24576;
            },
            isFIFO: (mode) => {
                return (mode & 61440) === 4096;
            },
            isSocket: (mode) => {
                return (mode & 49152) === 49152;
            },
            flagModes: {
                r: 0,
                'r+': 2,
                w: 577,
                'w+': 578,
                a: 1089,
                'a+': 1090,
            },
            modeStringToFlags: (str) => {
                var flags = FS.flagModes[str];
                if (typeof flags == 'undefined') {
                    throw new Error('Unknown file open mode: ' + str);
                }
                return flags;
            },
            flagsToPermissionString: (flag) => {
                var perms = ['r', 'w', 'rw'][flag & 3];
                if (flag & 512) {
                    perms += 'w';
                }
                return perms;
            },
            nodePermissions: (node, perms) => {
                if (FS.ignorePermissions) {
                    return 0;
                }
                if (perms.includes('r') && !(node.mode & 292)) {
                    return 2;
                } else if (perms.includes('w') && !(node.mode & 146)) {
                    return 2;
                } else if (perms.includes('x') && !(node.mode & 73)) {
                    return 2;
                }
                return 0;
            },
            mayLookup: (dir) => {
                var errCode = FS.nodePermissions(dir, 'x');
                if (errCode) return errCode;
                if (!dir.node_ops.lookup) return 2;
                return 0;
            },
            mayCreate: (dir, name) => {
                try {
                    var node = FS.lookupNode(dir, name);
                    return 20;
                } catch (e) {}
                return FS.nodePermissions(dir, 'wx');
            },
            mayDelete: (dir, name, isdir) => {
                var node;
                try {
                    node = FS.lookupNode(dir, name);
                } catch (e) {
                    return e.errno;
                }
                var errCode = FS.nodePermissions(dir, 'wx');
                if (errCode) {
                    return errCode;
                }
                if (isdir) {
                    if (!FS.isDir(node.mode)) {
                        return 54;
                    }
                    if (FS.isRoot(node) || FS.getPath(node) === FS.cwd()) {
                        return 10;
                    }
                } else {
                    if (FS.isDir(node.mode)) {
                        return 31;
                    }
                }
                return 0;
            },
            mayOpen: (node, flags) => {
                if (!node) {
                    return 44;
                }
                if (FS.isLink(node.mode)) {
                    return 32;
                } else if (FS.isDir(node.mode)) {
                    if (
                        FS.flagsToPermissionString(flags) !== 'r' ||
                        flags & 512
                    ) {
                        return 31;
                    }
                }
                return FS.nodePermissions(
                    node,
                    FS.flagsToPermissionString(flags)
                );
            },
            MAX_OPEN_FDS: 4096,
            nextfd: (fd_start = 0, fd_end = FS.MAX_OPEN_FDS) => {
                for (var fd = fd_start; fd <= fd_end; fd++) {
                    if (!FS.streams[fd]) {
                        return fd;
                    }
                }
                throw new FS.ErrnoError(33);
            },
            getStream: (fd) => FS.streams[fd],
            createStream: (stream, fd_start, fd_end) => {
                if (!FS.FSStream) {
                    FS.FSStream = function () {
                        this.shared = {};
                    };
                    FS.FSStream.prototype = {};
                    Object.defineProperties(FS.FSStream.prototype, {
                        object: {
                            get: function () {
                                return this.node;
                            },
                            set: function (val) {
                                this.node = val;
                            },
                        },
                        isRead: {
                            get: function () {
                                return (this.flags & 2097155) !== 1;
                            },
                        },
                        isWrite: {
                            get: function () {
                                return (this.flags & 2097155) !== 0;
                            },
                        },
                        isAppend: {
                            get: function () {
                                return this.flags & 1024;
                            },
                        },
                        flags: {
                            get: function () {
                                return this.shared.flags;
                            },
                            set: function (val) {
                                this.shared.flags = val;
                            },
                        },
                        position: {
                            get: function () {
                                return this.shared.position;
                            },
                            set: function (val) {
                                this.shared.position = val;
                            },
                        },
                    });
                }
                stream = Object.assign(new FS.FSStream(), stream);
                var fd = FS.nextfd(fd_start, fd_end);
                stream.fd = fd;
                FS.streams[fd] = stream;
                return stream;
            },
            closeStream: (fd) => {
                FS.streams[fd] = null;
            },
            chrdev_stream_ops: {
                open: (stream) => {
                    var device = FS.getDevice(stream.node.rdev);
                    stream.stream_ops = device.stream_ops;
                    if (stream.stream_ops.open) {
                        stream.stream_ops.open(stream);
                    }
                },
                llseek: () => {
                    throw new FS.ErrnoError(70);
                },
            },
            major: (dev) => dev >> 8,
            minor: (dev) => dev & 255,
            makedev: (ma, mi) => (ma << 8) | mi,
            registerDevice: (dev, ops) => {
                FS.devices[dev] = { stream_ops: ops };
            },
            getDevice: (dev) => FS.devices[dev],
            getMounts: (mount) => {
                var mounts = [];
                var check = [mount];
                while (check.length) {
                    var m = check.pop();
                    mounts.push(m);
                    check.push.apply(check, m.mounts);
                }
                return mounts;
            },
            syncfs: (populate, callback) => {
                if (typeof populate == 'function') {
                    callback = populate;
                    populate = false;
                }
                FS.syncFSRequests++;
                if (FS.syncFSRequests > 1) {
                    err(
                        'warning: ' +
                            FS.syncFSRequests +
                            ' FS.syncfs operations in flight at once, probably just doing extra work'
                    );
                }
                var mounts = FS.getMounts(FS.root.mount);
                var completed = 0;
                function doCallback(errCode) {
                    FS.syncFSRequests--;
                    return callback(errCode);
                }
                function done(errCode) {
                    if (errCode) {
                        if (!done.errored) {
                            done.errored = true;
                            return doCallback(errCode);
                        }
                        return;
                    }
                    if (++completed >= mounts.length) {
                        doCallback(null);
                    }
                }
                mounts.forEach((mount) => {
                    if (!mount.type.syncfs) {
                        return done(null);
                    }
                    mount.type.syncfs(mount, populate, done);
                });
            },
            mount: (type, opts, mountpoint) => {
                var root = mountpoint === '/';
                var pseudo = !mountpoint;
                var node;
                if (root && FS.root) {
                    throw new FS.ErrnoError(10);
                } else if (!root && !pseudo) {
                    var lookup = FS.lookupPath(mountpoint, {
                        follow_mount: false,
                    });
                    mountpoint = lookup.path;
                    node = lookup.node;
                    if (FS.isMountpoint(node)) {
                        throw new FS.ErrnoError(10);
                    }
                    if (!FS.isDir(node.mode)) {
                        throw new FS.ErrnoError(54);
                    }
                }
                var mount = {
                    type: type,
                    opts: opts,
                    mountpoint: mountpoint,
                    mounts: [],
                };
                var mountRoot = type.mount(mount);
                mountRoot.mount = mount;
                mount.root = mountRoot;
                if (root) {
                    FS.root = mountRoot;
                } else if (node) {
                    node.mounted = mount;
                    if (node.mount) {
                        node.mount.mounts.push(mount);
                    }
                }
                return mountRoot;
            },
            unmount: (mountpoint) => {
                var lookup = FS.lookupPath(mountpoint, { follow_mount: false });
                if (!FS.isMountpoint(lookup.node)) {
                    throw new FS.ErrnoError(28);
                }
                var node = lookup.node;
                var mount = node.mounted;
                var mounts = FS.getMounts(mount);
                Object.keys(FS.nameTable).forEach((hash) => {
                    var current = FS.nameTable[hash];
                    while (current) {
                        var next = current.name_next;
                        if (mounts.includes(current.mount)) {
                            FS.destroyNode(current);
                        }
                        current = next;
                    }
                });
                node.mounted = null;
                var idx = node.mount.mounts.indexOf(mount);
                node.mount.mounts.splice(idx, 1);
            },
            lookup: (parent, name) => {
                return parent.node_ops.lookup(parent, name);
            },
            mknod: (path, mode, dev) => {
                var lookup = FS.lookupPath(path, { parent: true });
                var parent = lookup.node;
                var name = PATH.basename(path);
                if (!name || name === '.' || name === '..') {
                    throw new FS.ErrnoError(28);
                }
                var errCode = FS.mayCreate(parent, name);
                if (errCode) {
                    throw new FS.ErrnoError(errCode);
                }
                if (!parent.node_ops.mknod) {
                    throw new FS.ErrnoError(63);
                }
                return parent.node_ops.mknod(parent, name, mode, dev);
            },
            create: (path, mode) => {
                mode = mode !== undefined ? mode : 438;
                mode &= 4095;
                mode |= 32768;
                return FS.mknod(path, mode, 0);
            },
            mkdir: (path, mode) => {
                mode = mode !== undefined ? mode : 511;
                mode &= 511 | 512;
                mode |= 16384;
                return FS.mknod(path, mode, 0);
            },
            mkdirTree: (path, mode) => {
                var dirs = path.split('/');
                var d = '';
                for (var i = 0; i < dirs.length; ++i) {
                    if (!dirs[i]) continue;
                    d += '/' + dirs[i];
                    try {
                        FS.mkdir(d, mode);
                    } catch (e) {
                        if (e.errno != 20) throw e;
                    }
                }
            },
            mkdev: (path, mode, dev) => {
                if (typeof dev == 'undefined') {
                    dev = mode;
                    mode = 438;
                }
                mode |= 8192;
                return FS.mknod(path, mode, dev);
            },
            symlink: (oldpath, newpath) => {
                if (!PATH_FS.resolve(oldpath)) {
                    throw new FS.ErrnoError(44);
                }
                var lookup = FS.lookupPath(newpath, { parent: true });
                var parent = lookup.node;
                if (!parent) {
                    throw new FS.ErrnoError(44);
                }
                var newname = PATH.basename(newpath);
                var errCode = FS.mayCreate(parent, newname);
                if (errCode) {
                    throw new FS.ErrnoError(errCode);
                }
                if (!parent.node_ops.symlink) {
                    throw new FS.ErrnoError(63);
                }
                return parent.node_ops.symlink(parent, newname, oldpath);
            },
            rename: (old_path, new_path) => {
                var old_dirname = PATH.dirname(old_path);
                var new_dirname = PATH.dirname(new_path);
                var old_name = PATH.basename(old_path);
                var new_name = PATH.basename(new_path);
                var lookup, old_dir, new_dir;
                lookup = FS.lookupPath(old_path, { parent: true });
                old_dir = lookup.node;
                lookup = FS.lookupPath(new_path, { parent: true });
                new_dir = lookup.node;
                if (!old_dir || !new_dir) throw new FS.ErrnoError(44);
                if (old_dir.mount !== new_dir.mount) {
                    throw new FS.ErrnoError(75);
                }
                var old_node = FS.lookupNode(old_dir, old_name);
                var relative = PATH_FS.relative(old_path, new_dirname);
                if (relative.charAt(0) !== '.') {
                    throw new FS.ErrnoError(28);
                }
                relative = PATH_FS.relative(new_path, old_dirname);
                if (relative.charAt(0) !== '.') {
                    throw new FS.ErrnoError(55);
                }
                var new_node;
                try {
                    new_node = FS.lookupNode(new_dir, new_name);
                } catch (e) {}
                if (old_node === new_node) {
                    return;
                }
                var isdir = FS.isDir(old_node.mode);
                var errCode = FS.mayDelete(old_dir, old_name, isdir);
                if (errCode) {
                    throw new FS.ErrnoError(errCode);
                }
                errCode = new_node
                    ? FS.mayDelete(new_dir, new_name, isdir)
                    : FS.mayCreate(new_dir, new_name);
                if (errCode) {
                    throw new FS.ErrnoError(errCode);
                }
                if (!old_dir.node_ops.rename) {
                    throw new FS.ErrnoError(63);
                }
                if (
                    FS.isMountpoint(old_node) ||
                    (new_node && FS.isMountpoint(new_node))
                ) {
                    throw new FS.ErrnoError(10);
                }
                if (new_dir !== old_dir) {
                    errCode = FS.nodePermissions(old_dir, 'w');
                    if (errCode) {
                        throw new FS.ErrnoError(errCode);
                    }
                }
                FS.hashRemoveNode(old_node);
                try {
                    old_dir.node_ops.rename(old_node, new_dir, new_name);
                } catch (e) {
                    throw e;
                } finally {
                    FS.hashAddNode(old_node);
                }
            },
            rmdir: (path) => {
                var lookup = FS.lookupPath(path, { parent: true });
                var parent = lookup.node;
                var name = PATH.basename(path);
                var node = FS.lookupNode(parent, name);
                var errCode = FS.mayDelete(parent, name, true);
                if (errCode) {
                    throw new FS.ErrnoError(errCode);
                }
                if (!parent.node_ops.rmdir) {
                    throw new FS.ErrnoError(63);
                }
                if (FS.isMountpoint(node)) {
                    throw new FS.ErrnoError(10);
                }
                parent.node_ops.rmdir(parent, name);
                FS.destroyNode(node);
            },
            readdir: (path) => {
                var lookup = FS.lookupPath(path, { follow: true });
                var node = lookup.node;
                if (!node.node_ops.readdir) {
                    throw new FS.ErrnoError(54);
                }
                return node.node_ops.readdir(node);
            },
            unlink: (path) => {
                var lookup = FS.lookupPath(path, { parent: true });
                var parent = lookup.node;
                if (!parent) {
                    throw new FS.ErrnoError(44);
                }
                var name = PATH.basename(path);
                var node = FS.lookupNode(parent, name);
                var errCode = FS.mayDelete(parent, name, false);
                if (errCode) {
                    throw new FS.ErrnoError(errCode);
                }
                if (!parent.node_ops.unlink) {
                    throw new FS.ErrnoError(63);
                }
                if (FS.isMountpoint(node)) {
                    throw new FS.ErrnoError(10);
                }
                parent.node_ops.unlink(parent, name);
                FS.destroyNode(node);
            },
            readlink: (path) => {
                var lookup = FS.lookupPath(path);
                var link = lookup.node;
                if (!link) {
                    throw new FS.ErrnoError(44);
                }
                if (!link.node_ops.readlink) {
                    throw new FS.ErrnoError(28);
                }
                return PATH_FS.resolve(
                    FS.getPath(link.parent),
                    link.node_ops.readlink(link)
                );
            },
            stat: (path, dontFollow) => {
                var lookup = FS.lookupPath(path, { follow: !dontFollow });
                var node = lookup.node;
                if (!node) {
                    throw new FS.ErrnoError(44);
                }
                if (!node.node_ops.getattr) {
                    throw new FS.ErrnoError(63);
                }
                return node.node_ops.getattr(node);
            },
            lstat: (path) => {
                return FS.stat(path, true);
            },
            chmod: (path, mode, dontFollow) => {
                var node;
                if (typeof path == 'string') {
                    var lookup = FS.lookupPath(path, { follow: !dontFollow });
                    node = lookup.node;
                } else {
                    node = path;
                }
                if (!node.node_ops.setattr) {
                    throw new FS.ErrnoError(63);
                }
                node.node_ops.setattr(node, {
                    mode: (mode & 4095) | (node.mode & ~4095),
                    timestamp: Date.now(),
                });
            },
            lchmod: (path, mode) => {
                FS.chmod(path, mode, true);
            },
            fchmod: (fd, mode) => {
                var stream = FS.getStream(fd);
                if (!stream) {
                    throw new FS.ErrnoError(8);
                }
                FS.chmod(stream.node, mode);
            },
            chown: (path, uid, gid, dontFollow) => {
                var node;
                if (typeof path == 'string') {
                    var lookup = FS.lookupPath(path, { follow: !dontFollow });
                    node = lookup.node;
                } else {
                    node = path;
                }
                if (!node.node_ops.setattr) {
                    throw new FS.ErrnoError(63);
                }
                node.node_ops.setattr(node, { timestamp: Date.now() });
            },
            lchown: (path, uid, gid) => {
                FS.chown(path, uid, gid, true);
            },
            fchown: (fd, uid, gid) => {
                var stream = FS.getStream(fd);
                if (!stream) {
                    throw new FS.ErrnoError(8);
                }
                FS.chown(stream.node, uid, gid);
            },
            truncate: (path, len) => {
                if (len < 0) {
                    throw new FS.ErrnoError(28);
                }
                var node;
                if (typeof path == 'string') {
                    var lookup = FS.lookupPath(path, { follow: true });
                    node = lookup.node;
                } else {
                    node = path;
                }
                if (!node.node_ops.setattr) {
                    throw new FS.ErrnoError(63);
                }
                if (FS.isDir(node.mode)) {
                    throw new FS.ErrnoError(31);
                }
                if (!FS.isFile(node.mode)) {
                    throw new FS.ErrnoError(28);
                }
                var errCode = FS.nodePermissions(node, 'w');
                if (errCode) {
                    throw new FS.ErrnoError(errCode);
                }
                node.node_ops.setattr(node, {
                    size: len,
                    timestamp: Date.now(),
                });
            },
            ftruncate: (fd, len) => {
                var stream = FS.getStream(fd);
                if (!stream) {
                    throw new FS.ErrnoError(8);
                }
                if ((stream.flags & 2097155) === 0) {
                    throw new FS.ErrnoError(28);
                }
                FS.truncate(stream.node, len);
            },
            utime: (path, atime, mtime) => {
                var lookup = FS.lookupPath(path, { follow: true });
                var node = lookup.node;
                node.node_ops.setattr(node, {
                    timestamp: Math.max(atime, mtime),
                });
            },
            open: (path, flags, mode) => {
                if (path === '') {
                    throw new FS.ErrnoError(44);
                }
                flags =
                    typeof flags == 'string'
                        ? FS.modeStringToFlags(flags)
                        : flags;
                mode = typeof mode == 'undefined' ? 438 : mode;
                if (flags & 64) {
                    mode = (mode & 4095) | 32768;
                } else {
                    mode = 0;
                }
                var node;
                if (typeof path == 'object') {
                    node = path;
                } else {
                    path = PATH.normalize(path);
                    try {
                        var lookup = FS.lookupPath(path, {
                            follow: !(flags & 131072),
                        });
                        node = lookup.node;
                    } catch (e) {}
                }
                var created = false;
                if (flags & 64) {
                    if (node) {
                        if (flags & 128) {
                            throw new FS.ErrnoError(20);
                        }
                    } else {
                        node = FS.mknod(path, mode, 0);
                        created = true;
                    }
                }
                if (!node) {
                    throw new FS.ErrnoError(44);
                }
                if (FS.isChrdev(node.mode)) {
                    flags &= ~512;
                }
                if (flags & 65536 && !FS.isDir(node.mode)) {
                    throw new FS.ErrnoError(54);
                }
                if (!created) {
                    var errCode = FS.mayOpen(node, flags);
                    if (errCode) {
                        throw new FS.ErrnoError(errCode);
                    }
                }
                if (flags & 512 && !created) {
                    FS.truncate(node, 0);
                }
                flags &= ~(128 | 512 | 131072);
                var stream = FS.createStream({
                    node: node,
                    path: FS.getPath(node),
                    flags: flags,
                    seekable: true,
                    position: 0,
                    stream_ops: node.stream_ops,
                    ungotten: [],
                    error: false,
                });
                if (stream.stream_ops.open) {
                    stream.stream_ops.open(stream);
                }
                if (Module['logReadFiles'] && !(flags & 1)) {
                    if (!FS.readFiles) FS.readFiles = {};
                    if (!(path in FS.readFiles)) {
                        FS.readFiles[path] = 1;
                    }
                }
                return stream;
            },
            close: (stream) => {
                if (FS.isClosed(stream)) {
                    throw new FS.ErrnoError(8);
                }
                if (stream.getdents) stream.getdents = null;
                try {
                    if (stream.stream_ops.close) {
                        stream.stream_ops.close(stream);
                    }
                } catch (e) {
                    throw e;
                } finally {
                    FS.closeStream(stream.fd);
                }
                stream.fd = null;
            },
            isClosed: (stream) => {
                return stream.fd === null;
            },
            llseek: (stream, offset, whence) => {
                if (FS.isClosed(stream)) {
                    throw new FS.ErrnoError(8);
                }
                if (!stream.seekable || !stream.stream_ops.llseek) {
                    throw new FS.ErrnoError(70);
                }
                if (whence != 0 && whence != 1 && whence != 2) {
                    throw new FS.ErrnoError(28);
                }
                stream.position = stream.stream_ops.llseek(
                    stream,
                    offset,
                    whence
                );
                stream.ungotten = [];
                return stream.position;
            },
            read: (stream, buffer, offset, length, position) => {
                if (length < 0 || position < 0) {
                    throw new FS.ErrnoError(28);
                }
                if (FS.isClosed(stream)) {
                    throw new FS.ErrnoError(8);
                }
                if ((stream.flags & 2097155) === 1) {
                    throw new FS.ErrnoError(8);
                }
                if (FS.isDir(stream.node.mode)) {
                    throw new FS.ErrnoError(31);
                }
                if (!stream.stream_ops.read) {
                    throw new FS.ErrnoError(28);
                }
                var seeking = typeof position != 'undefined';
                if (!seeking) {
                    position = stream.position;
                } else if (!stream.seekable) {
                    throw new FS.ErrnoError(70);
                }
                var bytesRead = stream.stream_ops.read(
                    stream,
                    buffer,
                    offset,
                    length,
                    position
                );
                if (!seeking) stream.position += bytesRead;
                return bytesRead;
            },
            write: (stream, buffer, offset, length, position, canOwn) => {
                if (length < 0 || position < 0) {
                    throw new FS.ErrnoError(28);
                }
                if (FS.isClosed(stream)) {
                    throw new FS.ErrnoError(8);
                }
                if ((stream.flags & 2097155) === 0) {
                    throw new FS.ErrnoError(8);
                }
                if (FS.isDir(stream.node.mode)) {
                    throw new FS.ErrnoError(31);
                }
                if (!stream.stream_ops.write) {
                    throw new FS.ErrnoError(28);
                }
                if (stream.seekable && stream.flags & 1024) {
                    FS.llseek(stream, 0, 2);
                }
                var seeking = typeof position != 'undefined';
                if (!seeking) {
                    position = stream.position;
                } else if (!stream.seekable) {
                    throw new FS.ErrnoError(70);
                }
                var bytesWritten = stream.stream_ops.write(
                    stream,
                    buffer,
                    offset,
                    length,
                    position,
                    canOwn
                );
                if (!seeking) stream.position += bytesWritten;
                return bytesWritten;
            },
            allocate: (stream, offset, length) => {
                if (FS.isClosed(stream)) {
                    throw new FS.ErrnoError(8);
                }
                if (offset < 0 || length <= 0) {
                    throw new FS.ErrnoError(28);
                }
                if ((stream.flags & 2097155) === 0) {
                    throw new FS.ErrnoError(8);
                }
                if (
                    !FS.isFile(stream.node.mode) &&
                    !FS.isDir(stream.node.mode)
                ) {
                    throw new FS.ErrnoError(43);
                }
                if (!stream.stream_ops.allocate) {
                    throw new FS.ErrnoError(138);
                }
                stream.stream_ops.allocate(stream, offset, length);
            },
            mmap: (stream, length, position, prot, flags) => {
                if (
                    (prot & 2) !== 0 &&
                    (flags & 2) === 0 &&
                    (stream.flags & 2097155) !== 2
                ) {
                    throw new FS.ErrnoError(2);
                }
                if ((stream.flags & 2097155) === 1) {
                    throw new FS.ErrnoError(2);
                }
                if (!stream.stream_ops.mmap) {
                    throw new FS.ErrnoError(43);
                }
                return stream.stream_ops.mmap(
                    stream,
                    length,
                    position,
                    prot,
                    flags
                );
            },
            msync: (stream, buffer, offset, length, mmapFlags) => {
                if (!stream.stream_ops.msync) {
                    return 0;
                }
                return stream.stream_ops.msync(
                    stream,
                    buffer,
                    offset,
                    length,
                    mmapFlags
                );
            },
            munmap: (stream) => 0,
            ioctl: (stream, cmd, arg) => {
                if (!stream.stream_ops.ioctl) {
                    throw new FS.ErrnoError(59);
                }
                return stream.stream_ops.ioctl(stream, cmd, arg);
            },
            readFile: (path, opts = {}) => {
                opts.flags = opts.flags || 0;
                opts.encoding = opts.encoding || 'binary';
                if (opts.encoding !== 'utf8' && opts.encoding !== 'binary') {
                    throw new Error(
                        'Invalid encoding type "' + opts.encoding + '"'
                    );
                }
                var ret;
                var stream = FS.open(path, opts.flags);
                var stat = FS.stat(path);
                var length = stat.size;
                var buf = new Uint8Array(length);
                FS.read(stream, buf, 0, length, 0);
                if (opts.encoding === 'utf8') {
                    ret = UTF8ArrayToString(buf, 0);
                } else if (opts.encoding === 'binary') {
                    ret = buf;
                }
                FS.close(stream);
                return ret;
            },
            writeFile: (path, data, opts = {}) => {
                opts.flags = opts.flags || 577;
                var stream = FS.open(path, opts.flags, opts.mode);
                if (typeof data == 'string') {
                    var buf = new Uint8Array(lengthBytesUTF8(data) + 1);
                    var actualNumBytes = stringToUTF8Array(
                        data,
                        buf,
                        0,
                        buf.length
                    );
                    FS.write(
                        stream,
                        buf,
                        0,
                        actualNumBytes,
                        undefined,
                        opts.canOwn
                    );
                } else if (ArrayBuffer.isView(data)) {
                    FS.write(
                        stream,
                        data,
                        0,
                        data.byteLength,
                        undefined,
                        opts.canOwn
                    );
                } else {
                    throw new Error('Unsupported data type');
                }
                FS.close(stream);
            },
            cwd: () => FS.currentPath,
            chdir: (path) => {
                var lookup = FS.lookupPath(path, { follow: true });
                if (lookup.node === null) {
                    throw new FS.ErrnoError(44);
                }
                if (!FS.isDir(lookup.node.mode)) {
                    throw new FS.ErrnoError(54);
                }
                var errCode = FS.nodePermissions(lookup.node, 'x');
                if (errCode) {
                    throw new FS.ErrnoError(errCode);
                }
                FS.currentPath = lookup.path;
            },
            createDefaultDirectories: () => {
                FS.mkdir('/tmp');
                FS.mkdir('/home');
                FS.mkdir('/home/web_user');
            },
            createDefaultDevices: () => {
                FS.mkdir('/dev');
                FS.registerDevice(FS.makedev(1, 3), {
                    read: () => 0,
                    write: (stream, buffer, offset, length, pos) => length,
                });
                FS.mkdev('/dev/null', FS.makedev(1, 3));
                TTY.register(FS.makedev(5, 0), TTY.default_tty_ops);
                TTY.register(FS.makedev(6, 0), TTY.default_tty1_ops);
                FS.mkdev('/dev/tty', FS.makedev(5, 0));
                FS.mkdev('/dev/tty1', FS.makedev(6, 0));
                var random_device = getRandomDevice();
                FS.createDevice('/dev', 'random', random_device);
                FS.createDevice('/dev', 'urandom', random_device);
                FS.mkdir('/dev/shm');
                FS.mkdir('/dev/shm/tmp');
            },
            createSpecialDirectories: () => {
                FS.mkdir('/proc');
                var proc_self = FS.mkdir('/proc/self');
                FS.mkdir('/proc/self/fd');
                FS.mount(
                    {
                        mount: () => {
                            var node = FS.createNode(
                                proc_self,
                                'fd',
                                16384 | 511,
                                73
                            );
                            node.node_ops = {
                                lookup: (parent, name) => {
                                    var fd = +name;
                                    var stream = FS.getStream(fd);
                                    if (!stream) throw new FS.ErrnoError(8);
                                    var ret = {
                                        parent: null,
                                        mount: { mountpoint: 'fake' },
                                        node_ops: {
                                            readlink: () => stream.path,
                                        },
                                    };
                                    ret.parent = ret;
                                    return ret;
                                },
                            };
                            return node;
                        },
                    },
                    {},
                    '/proc/self/fd'
                );
            },
            createStandardStreams: () => {
                if (Module['stdin']) {
                    FS.createDevice('/dev', 'stdin', Module['stdin']);
                } else {
                    FS.symlink('/dev/tty', '/dev/stdin');
                }
                if (Module['stdout']) {
                    FS.createDevice('/dev', 'stdout', null, Module['stdout']);
                } else {
                    FS.symlink('/dev/tty', '/dev/stdout');
                }
                if (Module['stderr']) {
                    FS.createDevice('/dev', 'stderr', null, Module['stderr']);
                } else {
                    FS.symlink('/dev/tty1', '/dev/stderr');
                }
                var stdin = FS.open('/dev/stdin', 0);
                var stdout = FS.open('/dev/stdout', 1);
                var stderr = FS.open('/dev/stderr', 1);
            },
            ensureErrnoError: () => {
                if (FS.ErrnoError) return;
                FS.ErrnoError = function ErrnoError(errno, node) {
                    this.node = node;
                    this.setErrno = function (errno) {
                        this.errno = errno;
                    };
                    this.setErrno(errno);
                    this.message = 'FS error';
                };
                FS.ErrnoError.prototype = new Error();
                FS.ErrnoError.prototype.constructor = FS.ErrnoError;
                [44].forEach((code) => {
                    FS.genericErrors[code] = new FS.ErrnoError(code);
                    FS.genericErrors[code].stack = '<generic error, no stack>';
                });
            },
            staticInit: () => {
                FS.ensureErrnoError();
                FS.nameTable = new Array(4096);
                FS.mount(MEMFS, {}, '/');
                FS.createDefaultDirectories();
                FS.createDefaultDevices();
                FS.createSpecialDirectories();
                FS.filesystems = { MEMFS: MEMFS };
            },
            init: (input, output, error) => {
                FS.init.initialized = true;
                FS.ensureErrnoError();
                Module['stdin'] = input || Module['stdin'];
                Module['stdout'] = output || Module['stdout'];
                Module['stderr'] = error || Module['stderr'];
                FS.createStandardStreams();
            },
            quit: () => {
                FS.init.initialized = false;
                for (var i = 0; i < FS.streams.length; i++) {
                    var stream = FS.streams[i];
                    if (!stream) {
                        continue;
                    }
                    FS.close(stream);
                }
            },
            getMode: (canRead, canWrite) => {
                var mode = 0;
                if (canRead) mode |= 292 | 73;
                if (canWrite) mode |= 146;
                return mode;
            },
            findObject: (path, dontResolveLastLink) => {
                var ret = FS.analyzePath(path, dontResolveLastLink);
                if (!ret.exists) {
                    return null;
                }
                return ret.object;
            },
            analyzePath: (path, dontResolveLastLink) => {
                try {
                    var lookup = FS.lookupPath(path, {
                        follow: !dontResolveLastLink,
                    });
                    path = lookup.path;
                } catch (e) {}
                var ret = {
                    isRoot: false,
                    exists: false,
                    error: 0,
                    name: null,
                    path: null,
                    object: null,
                    parentExists: false,
                    parentPath: null,
                    parentObject: null,
                };
                try {
                    var lookup = FS.lookupPath(path, { parent: true });
                    ret.parentExists = true;
                    ret.parentPath = lookup.path;
                    ret.parentObject = lookup.node;
                    ret.name = PATH.basename(path);
                    lookup = FS.lookupPath(path, {
                        follow: !dontResolveLastLink,
                    });
                    ret.exists = true;
                    ret.path = lookup.path;
                    ret.object = lookup.node;
                    ret.name = lookup.node.name;
                    ret.isRoot = lookup.path === '/';
                } catch (e) {
                    ret.error = e.errno;
                }
                return ret;
            },
            createPath: (parent, path, canRead, canWrite) => {
                parent =
                    typeof parent == 'string' ? parent : FS.getPath(parent);
                var parts = path.split('/').reverse();
                while (parts.length) {
                    var part = parts.pop();
                    if (!part) continue;
                    var current = PATH.join2(parent, part);
                    try {
                        FS.mkdir(current);
                    } catch (e) {}
                    parent = current;
                }
                return current;
            },
            createFile: (parent, name, properties, canRead, canWrite) => {
                var path = PATH.join2(
                    typeof parent == 'string' ? parent : FS.getPath(parent),
                    name
                );
                var mode = FS.getMode(canRead, canWrite);
                return FS.create(path, mode);
            },
            createDataFile: (parent, name, data, canRead, canWrite, canOwn) => {
                var path = name;
                if (parent) {
                    parent =
                        typeof parent == 'string' ? parent : FS.getPath(parent);
                    path = name ? PATH.join2(parent, name) : parent;
                }
                var mode = FS.getMode(canRead, canWrite);
                var node = FS.create(path, mode);
                if (data) {
                    if (typeof data == 'string') {
                        var arr = new Array(data.length);
                        for (var i = 0, len = data.length; i < len; ++i)
                            arr[i] = data.charCodeAt(i);
                        data = arr;
                    }
                    FS.chmod(node, mode | 146);
                    var stream = FS.open(node, 577);
                    FS.write(stream, data, 0, data.length, 0, canOwn);
                    FS.close(stream);
                    FS.chmod(node, mode);
                }
                return node;
            },
            createDevice: (parent, name, input, output) => {
                var path = PATH.join2(
                    typeof parent == 'string' ? parent : FS.getPath(parent),
                    name
                );
                var mode = FS.getMode(!!input, !!output);
                if (!FS.createDevice.major) FS.createDevice.major = 64;
                var dev = FS.makedev(FS.createDevice.major++, 0);
                FS.registerDevice(dev, {
                    open: (stream) => {
                        stream.seekable = false;
                    },
                    close: (stream) => {
                        if (output && output.buffer && output.buffer.length) {
                            output(10);
                        }
                    },
                    read: (stream, buffer, offset, length, pos) => {
                        var bytesRead = 0;
                        for (var i = 0; i < length; i++) {
                            var result;
                            try {
                                result = input();
                            } catch (e) {
                                throw new FS.ErrnoError(29);
                            }
                            if (result === undefined && bytesRead === 0) {
                                throw new FS.ErrnoError(6);
                            }
                            if (result === null || result === undefined) break;
                            bytesRead++;
                            buffer[offset + i] = result;
                        }
                        if (bytesRead) {
                            stream.node.timestamp = Date.now();
                        }
                        return bytesRead;
                    },
                    write: (stream, buffer, offset, length, pos) => {
                        for (var i = 0; i < length; i++) {
                            try {
                                output(buffer[offset + i]);
                            } catch (e) {
                                throw new FS.ErrnoError(29);
                            }
                        }
                        if (length) {
                            stream.node.timestamp = Date.now();
                        }
                        return i;
                    },
                });
                return FS.mkdev(path, mode, dev);
            },
            forceLoadFile: (obj) => {
                if (obj.isDevice || obj.isFolder || obj.link || obj.contents)
                    return true;
                if (typeof XMLHttpRequest != 'undefined') {
                    throw new Error(
                        'Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.'
                    );
                } else if (read_) {
                    try {
                        obj.contents = intArrayFromString(read_(obj.url), true);
                        obj.usedBytes = obj.contents.length;
                    } catch (e) {
                        throw new FS.ErrnoError(29);
                    }
                } else {
                    throw new Error(
                        'Cannot load without read() or XMLHttpRequest.'
                    );
                }
            },
            createLazyFile: (parent, name, url, canRead, canWrite) => {
                function LazyUint8Array() {
                    this.lengthKnown = false;
                    this.chunks = [];
                }
                LazyUint8Array.prototype.get = function LazyUint8Array_get(
                    idx
                ) {
                    if (idx > this.length - 1 || idx < 0) {
                        return undefined;
                    }
                    var chunkOffset = idx % this.chunkSize;
                    var chunkNum = (idx / this.chunkSize) | 0;
                    return this.getter(chunkNum)[chunkOffset];
                };
                LazyUint8Array.prototype.setDataGetter =
                    function LazyUint8Array_setDataGetter(getter) {
                        this.getter = getter;
                    };
                LazyUint8Array.prototype.cacheLength =
                    function LazyUint8Array_cacheLength() {
                        var xhr = new XMLHttpRequest();
                        xhr.open('HEAD', url, false);
                        xhr.send(null);
                        if (
                            !(
                                (xhr.status >= 200 && xhr.status < 300) ||
                                xhr.status === 304
                            )
                        )
                            throw new Error(
                                "Couldn't load " +
                                    url +
                                    '. Status: ' +
                                    xhr.status
                            );
                        var datalength = Number(
                            xhr.getResponseHeader('Content-length')
                        );
                        var header;
                        var hasByteServing =
                            (header = xhr.getResponseHeader('Accept-Ranges')) &&
                            header === 'bytes';
                        var usesGzip =
                            (header =
                                xhr.getResponseHeader('Content-Encoding')) &&
                            header === 'gzip';
                        var chunkSize = 1024 * 1024;
                        if (!hasByteServing) chunkSize = datalength;
                        var doXHR = (from, to) => {
                            if (from > to)
                                throw new Error(
                                    'invalid range (' +
                                        from +
                                        ', ' +
                                        to +
                                        ') or no bytes requested!'
                                );
                            if (to > datalength - 1)
                                throw new Error(
                                    'only ' +
                                        datalength +
                                        ' bytes available! programmer error!'
                                );
                            var xhr = new XMLHttpRequest();
                            xhr.open('GET', url, false);
                            if (datalength !== chunkSize)
                                xhr.setRequestHeader(
                                    'Range',
                                    'bytes=' + from + '-' + to
                                );
                            xhr.responseType = 'arraybuffer';
                            if (xhr.overrideMimeType) {
                                xhr.overrideMimeType(
                                    'text/plain; charset=x-user-defined'
                                );
                            }
                            xhr.send(null);
                            if (
                                !(
                                    (xhr.status >= 200 && xhr.status < 300) ||
                                    xhr.status === 304
                                )
                            )
                                throw new Error(
                                    "Couldn't load " +
                                        url +
                                        '. Status: ' +
                                        xhr.status
                                );
                            if (xhr.response !== undefined) {
                                return new Uint8Array(xhr.response || []);
                            }
                            return intArrayFromString(
                                xhr.responseText || '',
                                true
                            );
                        };
                        var lazyArray = this;
                        lazyArray.setDataGetter((chunkNum) => {
                            var start = chunkNum * chunkSize;
                            var end = (chunkNum + 1) * chunkSize - 1;
                            end = Math.min(end, datalength - 1);
                            if (
                                typeof lazyArray.chunks[chunkNum] == 'undefined'
                            ) {
                                lazyArray.chunks[chunkNum] = doXHR(start, end);
                            }
                            if (
                                typeof lazyArray.chunks[chunkNum] == 'undefined'
                            )
                                throw new Error('doXHR failed!');
                            return lazyArray.chunks[chunkNum];
                        });
                        if (usesGzip || !datalength) {
                            chunkSize = datalength = 1;
                            datalength = this.getter(0).length;
                            chunkSize = datalength;
                            out(
                                'LazyFiles on gzip forces download of the whole file when length is accessed'
                            );
                        }
                        this._length = datalength;
                        this._chunkSize = chunkSize;
                        this.lengthKnown = true;
                    };
                if (typeof XMLHttpRequest != 'undefined') {
                    if (!ENVIRONMENT_IS_WORKER)
                        throw 'Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc';
                    var lazyArray = new LazyUint8Array();
                    Object.defineProperties(lazyArray, {
                        length: {
                            get: function () {
                                if (!this.lengthKnown) {
                                    this.cacheLength();
                                }
                                return this._length;
                            },
                        },
                        chunkSize: {
                            get: function () {
                                if (!this.lengthKnown) {
                                    this.cacheLength();
                                }
                                return this._chunkSize;
                            },
                        },
                    });
                    var properties = { isDevice: false, contents: lazyArray };
                } else {
                    var properties = { isDevice: false, url: url };
                }
                var node = FS.createFile(
                    parent,
                    name,
                    properties,
                    canRead,
                    canWrite
                );
                if (properties.contents) {
                    node.contents = properties.contents;
                } else if (properties.url) {
                    node.contents = null;
                    node.url = properties.url;
                }
                Object.defineProperties(node, {
                    usedBytes: {
                        get: function () {
                            return this.contents.length;
                        },
                    },
                });
                var stream_ops = {};
                var keys = Object.keys(node.stream_ops);
                keys.forEach((key) => {
                    var fn = node.stream_ops[key];
                    stream_ops[key] = function forceLoadLazyFile() {
                        FS.forceLoadFile(node);
                        return fn.apply(null, arguments);
                    };
                });
                function writeChunks(stream, buffer, offset, length, position) {
                    var contents = stream.node.contents;
                    if (position >= contents.length) return 0;
                    var size = Math.min(contents.length - position, length);
                    if (contents.slice) {
                        for (var i = 0; i < size; i++) {
                            buffer[offset + i] = contents[position + i];
                        }
                    } else {
                        for (var i = 0; i < size; i++) {
                            buffer[offset + i] = contents.get(position + i);
                        }
                    }
                    return size;
                }
                stream_ops.read = (
                    stream,
                    buffer,
                    offset,
                    length,
                    position
                ) => {
                    FS.forceLoadFile(node);
                    return writeChunks(
                        stream,
                        buffer,
                        offset,
                        length,
                        position
                    );
                };
                stream_ops.mmap = (stream, length, position, prot, flags) => {
                    FS.forceLoadFile(node);
                    var ptr = mmapAlloc(length);
                    if (!ptr) {
                        throw new FS.ErrnoError(48);
                    }
                    writeChunks(stream, HEAP8, ptr, length, position);
                    return { ptr: ptr, allocated: true };
                };
                node.stream_ops = stream_ops;
                return node;
            },
            createPreloadedFile: (
                parent,
                name,
                url,
                canRead,
                canWrite,
                onload,
                onerror,
                dontCreateFile,
                canOwn,
                preFinish
            ) => {
                var fullname = name
                    ? PATH_FS.resolve(PATH.join2(parent, name))
                    : parent;
                var dep = getUniqueRunDependency('cp ' + fullname);
                function processData(byteArray) {
                    function finish(byteArray) {
                        if (preFinish) preFinish();
                        if (!dontCreateFile) {
                            FS.createDataFile(
                                parent,
                                name,
                                byteArray,
                                canRead,
                                canWrite,
                                canOwn
                            );
                        }
                        if (onload) onload();
                        removeRunDependency(dep);
                    }
                    if (
                        Browser.handledByPreloadPlugin(
                            byteArray,
                            fullname,
                            finish,
                            () => {
                                if (onerror) onerror();
                                removeRunDependency(dep);
                            }
                        )
                    ) {
                        return;
                    }
                    finish(byteArray);
                }
                addRunDependency(dep);
                if (typeof url == 'string') {
                    asyncLoad(
                        url,
                        (byteArray) => processData(byteArray),
                        onerror
                    );
                } else {
                    processData(url);
                }
            },
            indexedDB: () => {
                return (
                    window.indexedDB ||
                    window.mozIndexedDB ||
                    window.webkitIndexedDB ||
                    window.msIndexedDB
                );
            },
            DB_NAME: () => {
                return 'EM_FS_' + window.location.pathname;
            },
            DB_VERSION: 20,
            DB_STORE_NAME: 'FILE_DATA',
            saveFilesToDB: (paths, onload, onerror) => {
                onload = onload || (() => {});
                onerror = onerror || (() => {});
                var indexedDB = FS.indexedDB();
                try {
                    var openRequest = indexedDB.open(
                        FS.DB_NAME(),
                        FS.DB_VERSION
                    );
                } catch (e) {
                    return onerror(e);
                }
                openRequest.onupgradeneeded = () => {
                    out('creating db');
                    var db = openRequest.result;
                    db.createObjectStore(FS.DB_STORE_NAME);
                };
                openRequest.onsuccess = () => {
                    var db = openRequest.result;
                    var transaction = db.transaction(
                        [FS.DB_STORE_NAME],
                        'readwrite'
                    );
                    var files = transaction.objectStore(FS.DB_STORE_NAME);
                    var ok = 0,
                        fail = 0,
                        total = paths.length;
                    function finish() {
                        if (fail == 0) onload();
                        else onerror();
                    }
                    paths.forEach((path) => {
                        var putRequest = files.put(
                            FS.analyzePath(path).object.contents,
                            path
                        );
                        putRequest.onsuccess = () => {
                            ok++;
                            if (ok + fail == total) finish();
                        };
                        putRequest.onerror = () => {
                            fail++;
                            if (ok + fail == total) finish();
                        };
                    });
                    transaction.onerror = onerror;
                };
                openRequest.onerror = onerror;
            },
            loadFilesFromDB: (paths, onload, onerror) => {
                onload = onload || (() => {});
                onerror = onerror || (() => {});
                var indexedDB = FS.indexedDB();
                try {
                    var openRequest = indexedDB.open(
                        FS.DB_NAME(),
                        FS.DB_VERSION
                    );
                } catch (e) {
                    return onerror(e);
                }
                openRequest.onupgradeneeded = onerror;
                openRequest.onsuccess = () => {
                    var db = openRequest.result;
                    try {
                        var transaction = db.transaction(
                            [FS.DB_STORE_NAME],
                            'readonly'
                        );
                    } catch (e) {
                        onerror(e);
                        return;
                    }
                    var files = transaction.objectStore(FS.DB_STORE_NAME);
                    var ok = 0,
                        fail = 0,
                        total = paths.length;
                    function finish() {
                        if (fail == 0) onload();
                        else onerror();
                    }
                    paths.forEach((path) => {
                        var getRequest = files.get(path);
                        getRequest.onsuccess = () => {
                            if (FS.analyzePath(path).exists) {
                                FS.unlink(path);
                            }
                            FS.createDataFile(
                                PATH.dirname(path),
                                PATH.basename(path),
                                getRequest.result,
                                true,
                                true,
                                true
                            );
                            ok++;
                            if (ok + fail == total) finish();
                        };
                        getRequest.onerror = () => {
                            fail++;
                            if (ok + fail == total) finish();
                        };
                    });
                    transaction.onerror = onerror;
                };
                openRequest.onerror = onerror;
            },
        };
        var SYSCALLS = {
            DEFAULT_POLLMASK: 5,
            calculateAt: function (dirfd, path, allowEmpty) {
                if (PATH.isAbs(path)) {
                    return path;
                }
                var dir;
                if (dirfd === -100) {
                    dir = FS.cwd();
                } else {
                    var dirstream = SYSCALLS.getStreamFromFD(dirfd);
                    dir = dirstream.path;
                }
                if (path.length == 0) {
                    if (!allowEmpty) {
                        throw new FS.ErrnoError(44);
                    }
                    return dir;
                }
                return PATH.join2(dir, path);
            },
            doStat: function (func, path, buf) {
                try {
                    var stat = func(path);
                } catch (e) {
                    if (
                        e &&
                        e.node &&
                        PATH.normalize(path) !==
                            PATH.normalize(FS.getPath(e.node))
                    ) {
                        return -54;
                    }
                    throw e;
                }
                HEAP32[buf >> 2] = stat.dev;
                HEAP32[(buf + 8) >> 2] = stat.ino;
                HEAP32[(buf + 12) >> 2] = stat.mode;
                HEAPU32[(buf + 16) >> 2] = stat.nlink;
                HEAP32[(buf + 20) >> 2] = stat.uid;
                HEAP32[(buf + 24) >> 2] = stat.gid;
                HEAP32[(buf + 28) >> 2] = stat.rdev;
                (tempI64 = [
                    stat.size >>> 0,
                    ((tempDouble = stat.size),
                    +Math.abs(tempDouble) >= 1
                        ? tempDouble > 0
                            ? (Math.min(
                                  +Math.floor(tempDouble / 4294967296),
                                  4294967295
                              ) |
                                  0) >>>
                              0
                            : ~~+Math.ceil(
                                  (tempDouble - +(~~tempDouble >>> 0)) /
                                      4294967296
                              ) >>> 0
                        : 0),
                ]),
                    (HEAP32[(buf + 40) >> 2] = tempI64[0]),
                    (HEAP32[(buf + 44) >> 2] = tempI64[1]);
                HEAP32[(buf + 48) >> 2] = 4096;
                HEAP32[(buf + 52) >> 2] = stat.blocks;
                (tempI64 = [
                    Math.floor(stat.atime.getTime() / 1e3) >>> 0,
                    ((tempDouble = Math.floor(stat.atime.getTime() / 1e3)),
                    +Math.abs(tempDouble) >= 1
                        ? tempDouble > 0
                            ? (Math.min(
                                  +Math.floor(tempDouble / 4294967296),
                                  4294967295
                              ) |
                                  0) >>>
                              0
                            : ~~+Math.ceil(
                                  (tempDouble - +(~~tempDouble >>> 0)) /
                                      4294967296
                              ) >>> 0
                        : 0),
                ]),
                    (HEAP32[(buf + 56) >> 2] = tempI64[0]),
                    (HEAP32[(buf + 60) >> 2] = tempI64[1]);
                HEAPU32[(buf + 64) >> 2] = 0;
                (tempI64 = [
                    Math.floor(stat.mtime.getTime() / 1e3) >>> 0,
                    ((tempDouble = Math.floor(stat.mtime.getTime() / 1e3)),
                    +Math.abs(tempDouble) >= 1
                        ? tempDouble > 0
                            ? (Math.min(
                                  +Math.floor(tempDouble / 4294967296),
                                  4294967295
                              ) |
                                  0) >>>
                              0
                            : ~~+Math.ceil(
                                  (tempDouble - +(~~tempDouble >>> 0)) /
                                      4294967296
                              ) >>> 0
                        : 0),
                ]),
                    (HEAP32[(buf + 72) >> 2] = tempI64[0]),
                    (HEAP32[(buf + 76) >> 2] = tempI64[1]);
                HEAPU32[(buf + 80) >> 2] = 0;
                (tempI64 = [
                    Math.floor(stat.ctime.getTime() / 1e3) >>> 0,
                    ((tempDouble = Math.floor(stat.ctime.getTime() / 1e3)),
                    +Math.abs(tempDouble) >= 1
                        ? tempDouble > 0
                            ? (Math.min(
                                  +Math.floor(tempDouble / 4294967296),
                                  4294967295
                              ) |
                                  0) >>>
                              0
                            : ~~+Math.ceil(
                                  (tempDouble - +(~~tempDouble >>> 0)) /
                                      4294967296
                              ) >>> 0
                        : 0),
                ]),
                    (HEAP32[(buf + 88) >> 2] = tempI64[0]),
                    (HEAP32[(buf + 92) >> 2] = tempI64[1]);
                HEAPU32[(buf + 96) >> 2] = 0;
                (tempI64 = [
                    stat.ino >>> 0,
                    ((tempDouble = stat.ino),
                    +Math.abs(tempDouble) >= 1
                        ? tempDouble > 0
                            ? (Math.min(
                                  +Math.floor(tempDouble / 4294967296),
                                  4294967295
                              ) |
                                  0) >>>
                              0
                            : ~~+Math.ceil(
                                  (tempDouble - +(~~tempDouble >>> 0)) /
                                      4294967296
                              ) >>> 0
                        : 0),
                ]),
                    (HEAP32[(buf + 104) >> 2] = tempI64[0]),
                    (HEAP32[(buf + 108) >> 2] = tempI64[1]);
                return 0;
            },
            doMsync: function (addr, stream, len, flags, offset) {
                if (!FS.isFile(stream.node.mode)) {
                    throw new FS.ErrnoError(43);
                }
                if (flags & 2) {
                    return 0;
                }
                var buffer = HEAPU8.slice(addr, addr + len);
                FS.msync(stream, buffer, offset, len, flags);
            },
            varargs: undefined,
            get: function () {
                SYSCALLS.varargs += 4;
                var ret = HEAP32[(SYSCALLS.varargs - 4) >> 2];
                return ret;
            },
            getStr: function (ptr) {
                var ret = UTF8ToString(ptr);
                return ret;
            },
            getStreamFromFD: function (fd) {
                var stream = FS.getStream(fd);
                if (!stream) throw new FS.ErrnoError(8);
                return stream;
            },
        };
        function ___syscall__newselect(
            nfds,
            readfds,
            writefds,
            exceptfds,
            timeout
        ) {
            try {
                var total = 0;
                var srcReadLow = readfds ? HEAP32[readfds >> 2] : 0,
                    srcReadHigh = readfds ? HEAP32[(readfds + 4) >> 2] : 0;
                var srcWriteLow = writefds ? HEAP32[writefds >> 2] : 0,
                    srcWriteHigh = writefds ? HEAP32[(writefds + 4) >> 2] : 0;
                var srcExceptLow = exceptfds ? HEAP32[exceptfds >> 2] : 0,
                    srcExceptHigh = exceptfds
                        ? HEAP32[(exceptfds + 4) >> 2]
                        : 0;
                var dstReadLow = 0,
                    dstReadHigh = 0;
                var dstWriteLow = 0,
                    dstWriteHigh = 0;
                var dstExceptLow = 0,
                    dstExceptHigh = 0;
                var allLow =
                    (readfds ? HEAP32[readfds >> 2] : 0) |
                    (writefds ? HEAP32[writefds >> 2] : 0) |
                    (exceptfds ? HEAP32[exceptfds >> 2] : 0);
                var allHigh =
                    (readfds ? HEAP32[(readfds + 4) >> 2] : 0) |
                    (writefds ? HEAP32[(writefds + 4) >> 2] : 0) |
                    (exceptfds ? HEAP32[(exceptfds + 4) >> 2] : 0);
                var check = function (fd, low, high, val) {
                    return fd < 32 ? low & val : high & val;
                };
                for (var fd = 0; fd < nfds; fd++) {
                    var mask = 1 << fd % 32;
                    if (!check(fd, allLow, allHigh, mask)) {
                        continue;
                    }
                    var stream = SYSCALLS.getStreamFromFD(fd);
                    var flags = SYSCALLS.DEFAULT_POLLMASK;
                    if (stream.stream_ops.poll) {
                        flags = stream.stream_ops.poll(stream);
                    }
                    if (flags & 1 && check(fd, srcReadLow, srcReadHigh, mask)) {
                        fd < 32
                            ? (dstReadLow = dstReadLow | mask)
                            : (dstReadHigh = dstReadHigh | mask);
                        total++;
                    }
                    if (
                        flags & 4 &&
                        check(fd, srcWriteLow, srcWriteHigh, mask)
                    ) {
                        fd < 32
                            ? (dstWriteLow = dstWriteLow | mask)
                            : (dstWriteHigh = dstWriteHigh | mask);
                        total++;
                    }
                    if (
                        flags & 2 &&
                        check(fd, srcExceptLow, srcExceptHigh, mask)
                    ) {
                        fd < 32
                            ? (dstExceptLow = dstExceptLow | mask)
                            : (dstExceptHigh = dstExceptHigh | mask);
                        total++;
                    }
                }
                if (readfds) {
                    HEAP32[readfds >> 2] = dstReadLow;
                    HEAP32[(readfds + 4) >> 2] = dstReadHigh;
                }
                if (writefds) {
                    HEAP32[writefds >> 2] = dstWriteLow;
                    HEAP32[(writefds + 4) >> 2] = dstWriteHigh;
                }
                if (exceptfds) {
                    HEAP32[exceptfds >> 2] = dstExceptLow;
                    HEAP32[(exceptfds + 4) >> 2] = dstExceptHigh;
                }
                return total;
            } catch (e) {
                if (typeof FS == 'undefined' || !(e instanceof FS.ErrnoError))
                    throw e;
                return -e.errno;
            }
        }
        function ___syscall_dup3(fd, suggestFD, flags) {
            try {
                var old = SYSCALLS.getStreamFromFD(fd);
                if (old.fd === suggestFD) return -28;
                var suggest = FS.getStream(suggestFD);
                if (suggest) FS.close(suggest);
                return FS.createStream(old, suggestFD, suggestFD + 1).fd;
            } catch (e) {
                if (typeof FS == 'undefined' || !(e instanceof FS.ErrnoError))
                    throw e;
                return -e.errno;
            }
        }
        function setErrNo(value) {
            HEAP32[___errno_location() >> 2] = value;
            return value;
        }
        function ___syscall_fcntl64(fd, cmd, varargs) {
            SYSCALLS.varargs = varargs;
            try {
                var stream = SYSCALLS.getStreamFromFD(fd);
                switch (cmd) {
                    case 0: {
                        var arg = SYSCALLS.get();
                        if (arg < 0) {
                            return -28;
                        }
                        var newStream;
                        newStream = FS.createStream(stream, arg);
                        return newStream.fd;
                    }
                    case 1:
                    case 2:
                        return 0;
                    case 3:
                        return stream.flags;
                    case 4: {
                        var arg = SYSCALLS.get();
                        stream.flags |= arg;
                        return 0;
                    }
                    case 5: {
                        var arg = SYSCALLS.get();
                        var offset = 0;
                        HEAP16[(arg + offset) >> 1] = 2;
                        return 0;
                    }
                    case 6:
                    case 7:
                        return 0;
                    case 16:
                    case 8:
                        return -28;
                    case 9:
                        setErrNo(28);
                        return -1;
                    default: {
                        return -28;
                    }
                }
            } catch (e) {
                if (typeof FS == 'undefined' || !(e instanceof FS.ErrnoError))
                    throw e;
                return -e.errno;
            }
        }
        function ___syscall_fstat64(fd, buf) {
            try {
                var stream = SYSCALLS.getStreamFromFD(fd);
                return SYSCALLS.doStat(FS.stat, stream.path, buf);
            } catch (e) {
                if (typeof FS == 'undefined' || !(e instanceof FS.ErrnoError))
                    throw e;
                return -e.errno;
            }
        }
        function ___syscall_getcwd(buf, size) {
            try {
                if (size === 0) return -28;
                var cwd = FS.cwd();
                var cwdLengthInBytes = lengthBytesUTF8(cwd) + 1;
                if (size < cwdLengthInBytes) return -68;
                stringToUTF8(cwd, buf, size);
                return cwdLengthInBytes;
            } catch (e) {
                if (typeof FS == 'undefined' || !(e instanceof FS.ErrnoError))
                    throw e;
                return -e.errno;
            }
        }
        function ___syscall_getdents64(fd, dirp, count) {
            try {
                var stream = SYSCALLS.getStreamFromFD(fd);
                if (!stream.getdents) {
                    stream.getdents = FS.readdir(stream.path);
                }
                var struct_size = 280;
                var pos = 0;
                var off = FS.llseek(stream, 0, 1);
                var idx = Math.floor(off / struct_size);
                while (
                    idx < stream.getdents.length &&
                    pos + struct_size <= count
                ) {
                    var id;
                    var type;
                    var name = stream.getdents[idx];
                    if (name === '.') {
                        id = stream.node.id;
                        type = 4;
                    } else if (name === '..') {
                        var lookup = FS.lookupPath(stream.path, {
                            parent: true,
                        });
                        id = lookup.node.id;
                        type = 4;
                    } else {
                        var child = FS.lookupNode(stream.node, name);
                        id = child.id;
                        type = FS.isChrdev(child.mode)
                            ? 2
                            : FS.isDir(child.mode)
                            ? 4
                            : FS.isLink(child.mode)
                            ? 10
                            : 8;
                    }
                    (tempI64 = [
                        id >>> 0,
                        ((tempDouble = id),
                        +Math.abs(tempDouble) >= 1
                            ? tempDouble > 0
                                ? (Math.min(
                                      +Math.floor(tempDouble / 4294967296),
                                      4294967295
                                  ) |
                                      0) >>>
                                  0
                                : ~~+Math.ceil(
                                      (tempDouble - +(~~tempDouble >>> 0)) /
                                          4294967296
                                  ) >>> 0
                            : 0),
                    ]),
                        (HEAP32[(dirp + pos) >> 2] = tempI64[0]),
                        (HEAP32[(dirp + pos + 4) >> 2] = tempI64[1]);
                    (tempI64 = [
                        ((idx + 1) * struct_size) >>> 0,
                        ((tempDouble = (idx + 1) * struct_size),
                        +Math.abs(tempDouble) >= 1
                            ? tempDouble > 0
                                ? (Math.min(
                                      +Math.floor(tempDouble / 4294967296),
                                      4294967295
                                  ) |
                                      0) >>>
                                  0
                                : ~~+Math.ceil(
                                      (tempDouble - +(~~tempDouble >>> 0)) /
                                          4294967296
                                  ) >>> 0
                            : 0),
                    ]),
                        (HEAP32[(dirp + pos + 8) >> 2] = tempI64[0]),
                        (HEAP32[(dirp + pos + 12) >> 2] = tempI64[1]);
                    HEAP16[(dirp + pos + 16) >> 1] = 280;
                    HEAP8[(dirp + pos + 18) >> 0] = type;
                    stringToUTF8(name, dirp + pos + 19, 256);
                    pos += struct_size;
                    idx += 1;
                }
                FS.llseek(stream, idx * struct_size, 0);
                return pos;
            } catch (e) {
                if (typeof FS == 'undefined' || !(e instanceof FS.ErrnoError))
                    throw e;
                return -e.errno;
            }
        }
        function ___syscall_ioctl(fd, op, varargs) {
            SYSCALLS.varargs = varargs;
            try {
                var stream = SYSCALLS.getStreamFromFD(fd);
                switch (op) {
                    case 21509:
                    case 21505: {
                        if (!stream.tty) return -59;
                        return 0;
                    }
                    case 21510:
                    case 21511:
                    case 21512:
                    case 21506:
                    case 21507:
                    case 21508: {
                        if (!stream.tty) return -59;
                        return 0;
                    }
                    case 21519: {
                        if (!stream.tty) return -59;
                        var argp = SYSCALLS.get();
                        HEAP32[argp >> 2] = 0;
                        return 0;
                    }
                    case 21520: {
                        if (!stream.tty) return -59;
                        return -28;
                    }
                    case 21531: {
                        var argp = SYSCALLS.get();
                        return FS.ioctl(stream, op, argp);
                    }
                    case 21523: {
                        if (!stream.tty) return -59;
                        return 0;
                    }
                    case 21524: {
                        if (!stream.tty) return -59;
                        return 0;
                    }
                    default:
                        return -28;
                }
            } catch (e) {
                if (typeof FS == 'undefined' || !(e instanceof FS.ErrnoError))
                    throw e;
                return -e.errno;
            }
        }
        function ___syscall_lstat64(path, buf) {
            try {
                path = SYSCALLS.getStr(path);
                return SYSCALLS.doStat(FS.lstat, path, buf);
            } catch (e) {
                if (typeof FS == 'undefined' || !(e instanceof FS.ErrnoError))
                    throw e;
                return -e.errno;
            }
        }
        function ___syscall_mkdirat(dirfd, path, mode) {
            try {
                path = SYSCALLS.getStr(path);
                path = SYSCALLS.calculateAt(dirfd, path);
                path = PATH.normalize(path);
                if (path[path.length - 1] === '/')
                    path = path.substr(0, path.length - 1);
                FS.mkdir(path, mode, 0);
                return 0;
            } catch (e) {
                if (typeof FS == 'undefined' || !(e instanceof FS.ErrnoError))
                    throw e;
                return -e.errno;
            }
        }
        function ___syscall_newfstatat(dirfd, path, buf, flags) {
            try {
                path = SYSCALLS.getStr(path);
                var nofollow = flags & 256;
                var allowEmpty = flags & 4096;
                flags = flags & ~4352;
                path = SYSCALLS.calculateAt(dirfd, path, allowEmpty);
                return SYSCALLS.doStat(
                    nofollow ? FS.lstat : FS.stat,
                    path,
                    buf
                );
            } catch (e) {
                if (typeof FS == 'undefined' || !(e instanceof FS.ErrnoError))
                    throw e;
                return -e.errno;
            }
        }
        function ___syscall_openat(dirfd, path, flags, varargs) {
            SYSCALLS.varargs = varargs;
            try {
                path = SYSCALLS.getStr(path);
                path = SYSCALLS.calculateAt(dirfd, path);
                var mode = varargs ? SYSCALLS.get() : 0;
                return FS.open(path, flags, mode).fd;
            } catch (e) {
                if (typeof FS == 'undefined' || !(e instanceof FS.ErrnoError))
                    throw e;
                return -e.errno;
            }
        }
        var PIPEFS = {
            BUCKET_BUFFER_SIZE: 8192,
            mount: function (mount) {
                return FS.createNode(null, '/', 16384 | 511, 0);
            },
            createPipe: function () {
                var pipe = { buckets: [], refcnt: 2 };
                pipe.buckets.push({
                    buffer: new Uint8Array(PIPEFS.BUCKET_BUFFER_SIZE),
                    offset: 0,
                    roffset: 0,
                });
                var rName = PIPEFS.nextname();
                var wName = PIPEFS.nextname();
                var rNode = FS.createNode(PIPEFS.root, rName, 4096, 0);
                var wNode = FS.createNode(PIPEFS.root, wName, 4096, 0);
                rNode.pipe = pipe;
                wNode.pipe = pipe;
                var readableStream = FS.createStream({
                    path: rName,
                    node: rNode,
                    flags: 0,
                    seekable: false,
                    stream_ops: PIPEFS.stream_ops,
                });
                rNode.stream = readableStream;
                var writableStream = FS.createStream({
                    path: wName,
                    node: wNode,
                    flags: 1,
                    seekable: false,
                    stream_ops: PIPEFS.stream_ops,
                });
                wNode.stream = writableStream;
                return {
                    readable_fd: readableStream.fd,
                    writable_fd: writableStream.fd,
                };
            },
            stream_ops: {
                poll: function (stream) {
                    var pipe = stream.node.pipe;
                    if ((stream.flags & 2097155) === 1) {
                        return 256 | 4;
                    }
                    if (pipe.buckets.length > 0) {
                        for (var i = 0; i < pipe.buckets.length; i++) {
                            var bucket = pipe.buckets[i];
                            if (bucket.offset - bucket.roffset > 0) {
                                return 64 | 1;
                            }
                        }
                    }
                    return 0;
                },
                ioctl: function (stream, request, varargs) {
                    return 28;
                },
                fsync: function (stream) {
                    return 28;
                },
                read: function (stream, buffer, offset, length, position) {
                    var pipe = stream.node.pipe;
                    var currentLength = 0;
                    for (var i = 0; i < pipe.buckets.length; i++) {
                        var bucket = pipe.buckets[i];
                        currentLength += bucket.offset - bucket.roffset;
                    }
                    assert(
                        buffer instanceof ArrayBuffer ||
                            ArrayBuffer.isView(buffer)
                    );
                    var data = buffer.subarray(offset, offset + length);
                    if (length <= 0) {
                        return 0;
                    }
                    if (currentLength == 0) {
                        throw new FS.ErrnoError(6);
                    }
                    var toRead = Math.min(currentLength, length);
                    var totalRead = toRead;
                    var toRemove = 0;
                    for (var i = 0; i < pipe.buckets.length; i++) {
                        var currBucket = pipe.buckets[i];
                        var bucketSize = currBucket.offset - currBucket.roffset;
                        if (toRead <= bucketSize) {
                            var tmpSlice = currBucket.buffer.subarray(
                                currBucket.roffset,
                                currBucket.offset
                            );
                            if (toRead < bucketSize) {
                                tmpSlice = tmpSlice.subarray(0, toRead);
                                currBucket.roffset += toRead;
                            } else {
                                toRemove++;
                            }
                            data.set(tmpSlice);
                            break;
                        } else {
                            var tmpSlice = currBucket.buffer.subarray(
                                currBucket.roffset,
                                currBucket.offset
                            );
                            data.set(tmpSlice);
                            data = data.subarray(tmpSlice.byteLength);
                            toRead -= tmpSlice.byteLength;
                            toRemove++;
                        }
                    }
                    if (toRemove && toRemove == pipe.buckets.length) {
                        toRemove--;
                        pipe.buckets[toRemove].offset = 0;
                        pipe.buckets[toRemove].roffset = 0;
                    }
                    pipe.buckets.splice(0, toRemove);
                    return totalRead;
                },
                write: function (stream, buffer, offset, length, position) {
                    var pipe = stream.node.pipe;
                    assert(
                        buffer instanceof ArrayBuffer ||
                            ArrayBuffer.isView(buffer)
                    );
                    var data = buffer.subarray(offset, offset + length);
                    var dataLen = data.byteLength;
                    if (dataLen <= 0) {
                        return 0;
                    }
                    var currBucket = null;
                    if (pipe.buckets.length == 0) {
                        currBucket = {
                            buffer: new Uint8Array(PIPEFS.BUCKET_BUFFER_SIZE),
                            offset: 0,
                            roffset: 0,
                        };
                        pipe.buckets.push(currBucket);
                    } else {
                        currBucket = pipe.buckets[pipe.buckets.length - 1];
                    }
                    assert(currBucket.offset <= PIPEFS.BUCKET_BUFFER_SIZE);
                    var freeBytesInCurrBuffer =
                        PIPEFS.BUCKET_BUFFER_SIZE - currBucket.offset;
                    if (freeBytesInCurrBuffer >= dataLen) {
                        currBucket.buffer.set(data, currBucket.offset);
                        currBucket.offset += dataLen;
                        return dataLen;
                    } else if (freeBytesInCurrBuffer > 0) {
                        currBucket.buffer.set(
                            data.subarray(0, freeBytesInCurrBuffer),
                            currBucket.offset
                        );
                        currBucket.offset += freeBytesInCurrBuffer;
                        data = data.subarray(
                            freeBytesInCurrBuffer,
                            data.byteLength
                        );
                    }
                    var numBuckets =
                        (data.byteLength / PIPEFS.BUCKET_BUFFER_SIZE) | 0;
                    var remElements =
                        data.byteLength % PIPEFS.BUCKET_BUFFER_SIZE;
                    for (var i = 0; i < numBuckets; i++) {
                        var newBucket = {
                            buffer: new Uint8Array(PIPEFS.BUCKET_BUFFER_SIZE),
                            offset: PIPEFS.BUCKET_BUFFER_SIZE,
                            roffset: 0,
                        };
                        pipe.buckets.push(newBucket);
                        newBucket.buffer.set(
                            data.subarray(0, PIPEFS.BUCKET_BUFFER_SIZE)
                        );
                        data = data.subarray(
                            PIPEFS.BUCKET_BUFFER_SIZE,
                            data.byteLength
                        );
                    }
                    if (remElements > 0) {
                        var newBucket = {
                            buffer: new Uint8Array(PIPEFS.BUCKET_BUFFER_SIZE),
                            offset: data.byteLength,
                            roffset: 0,
                        };
                        pipe.buckets.push(newBucket);
                        newBucket.buffer.set(data);
                    }
                    return dataLen;
                },
                close: function (stream) {
                    var pipe = stream.node.pipe;
                    pipe.refcnt--;
                    if (pipe.refcnt === 0) {
                        pipe.buckets = null;
                    }
                },
            },
            nextname: function () {
                if (!PIPEFS.nextname.current) {
                    PIPEFS.nextname.current = 0;
                }
                return 'pipe[' + PIPEFS.nextname.current++ + ']';
            },
        };
        function ___syscall_pipe(fdPtr) {
            try {
                if (fdPtr == 0) {
                    throw new FS.ErrnoError(21);
                }
                var res = PIPEFS.createPipe();
                HEAP32[fdPtr >> 2] = res.readable_fd;
                HEAP32[(fdPtr + 4) >> 2] = res.writable_fd;
                return 0;
            } catch (e) {
                if (typeof FS == 'undefined' || !(e instanceof FS.ErrnoError))
                    throw e;
                return -e.errno;
            }
        }
        function ___syscall_readlinkat(dirfd, path, buf, bufsize) {
            try {
                path = SYSCALLS.getStr(path);
                path = SYSCALLS.calculateAt(dirfd, path);
                if (bufsize <= 0) return -28;
                var ret = FS.readlink(path);
                var len = Math.min(bufsize, lengthBytesUTF8(ret));
                var endChar = HEAP8[buf + len];
                stringToUTF8(ret, buf, bufsize + 1);
                HEAP8[buf + len] = endChar;
                return len;
            } catch (e) {
                if (typeof FS == 'undefined' || !(e instanceof FS.ErrnoError))
                    throw e;
                return -e.errno;
            }
        }
        function ___syscall_rmdir(path) {
            try {
                path = SYSCALLS.getStr(path);
                FS.rmdir(path);
                return 0;
            } catch (e) {
                if (typeof FS == 'undefined' || !(e instanceof FS.ErrnoError))
                    throw e;
                return -e.errno;
            }
        }
        function ___syscall_stat64(path, buf) {
            try {
                path = SYSCALLS.getStr(path);
                return SYSCALLS.doStat(FS.stat, path, buf);
            } catch (e) {
                if (typeof FS == 'undefined' || !(e instanceof FS.ErrnoError))
                    throw e;
                return -e.errno;
            }
        }
        function ___syscall_unlinkat(dirfd, path, flags) {
            try {
                path = SYSCALLS.getStr(path);
                path = SYSCALLS.calculateAt(dirfd, path);
                if (flags === 0) {
                    FS.unlink(path);
                } else if (flags === 512) {
                    FS.rmdir(path);
                } else {
                    abort('Invalid flags passed to unlinkat');
                }
                return 0;
            } catch (e) {
                if (typeof FS == 'undefined' || !(e instanceof FS.ErrnoError))
                    throw e;
                return -e.errno;
            }
        }
        var nowIsMonotonic = true;
        function __emscripten_get_now_is_monotonic() {
            return nowIsMonotonic;
        }
        function _abort() {
            abort('');
        }
        function _emscripten_date_now() {
            return Date.now();
        }
        function getHeapMax() {
            return 2147483648;
        }
        function _emscripten_get_heap_max() {
            return getHeapMax();
        }
        var _emscripten_get_now;
        if (ENVIRONMENT_IS_NODE) {
            _emscripten_get_now = () => {
                var t = process['hrtime']();
                return t[0] * 1e3 + t[1] / 1e6;
            };
        } else _emscripten_get_now = () => performance.now();
        function _emscripten_memcpy_big(dest, src, num) {
            HEAPU8.copyWithin(dest, src, src + num);
        }
        function emscripten_realloc_buffer(size) {
            try {
                wasmMemory.grow((size - buffer.byteLength + 65535) >>> 16);
                updateGlobalBufferAndViews(wasmMemory.buffer);
                return 1;
            } catch (e) {}
        }
        function _emscripten_resize_heap(requestedSize) {
            var oldSize = HEAPU8.length;
            requestedSize = requestedSize >>> 0;
            var maxHeapSize = getHeapMax();
            if (requestedSize > maxHeapSize) {
                return false;
            }
            let alignUp = (x, multiple) =>
                x + ((multiple - (x % multiple)) % multiple);
            for (var cutDown = 1; cutDown <= 4; cutDown *= 2) {
                var overGrownHeapSize = oldSize * (1 + 0.2 / cutDown);
                overGrownHeapSize = Math.min(
                    overGrownHeapSize,
                    requestedSize + 100663296
                );
                var newSize = Math.min(
                    maxHeapSize,
                    alignUp(Math.max(requestedSize, overGrownHeapSize), 65536)
                );
                var replacement = emscripten_realloc_buffer(newSize);
                if (replacement) {
                    return true;
                }
            }
            return false;
        }
        var ENV = {};
        function getExecutableName() {
            return thisProgram || './this.program';
        }
        function getEnvStrings() {
            if (!getEnvStrings.strings) {
                var lang =
                    (
                        (typeof navigator == 'object' &&
                            navigator.languages &&
                            navigator.languages[0]) ||
                        'C'
                    ).replace('-', '_') + '.UTF-8';
                var env = {
                    USER: 'web_user',
                    LOGNAME: 'web_user',
                    PATH: '/',
                    PWD: '/',
                    HOME: '/home/web_user',
                    LANG: lang,
                    _: getExecutableName(),
                };
                for (var x in ENV) {
                    if (ENV[x] === undefined) delete env[x];
                    else env[x] = ENV[x];
                }
                var strings = [];
                for (var x in env) {
                    strings.push(x + '=' + env[x]);
                }
                getEnvStrings.strings = strings;
            }
            return getEnvStrings.strings;
        }
        function writeAsciiToMemory(str, buffer, dontAddNull) {
            for (var i = 0; i < str.length; ++i) {
                HEAP8[buffer++ >> 0] = str.charCodeAt(i);
            }
            if (!dontAddNull) HEAP8[buffer >> 0] = 0;
        }
        function _environ_get(__environ, environ_buf) {
            var bufSize = 0;
            getEnvStrings().forEach(function (string, i) {
                var ptr = environ_buf + bufSize;
                HEAPU32[(__environ + i * 4) >> 2] = ptr;
                writeAsciiToMemory(string, ptr);
                bufSize += string.length + 1;
            });
            return 0;
        }
        function _environ_sizes_get(penviron_count, penviron_buf_size) {
            var strings = getEnvStrings();
            HEAPU32[penviron_count >> 2] = strings.length;
            var bufSize = 0;
            strings.forEach(function (string) {
                bufSize += string.length + 1;
            });
            HEAPU32[penviron_buf_size >> 2] = bufSize;
            return 0;
        }
        function _proc_exit(code) {
            EXITSTATUS = code;
            if (!keepRuntimeAlive()) {
                if (Module['onExit']) Module['onExit'](code);
                ABORT = true;
            }
            quit_(code, new ExitStatus(code));
        }
        function exitJS(status, implicit) {
            EXITSTATUS = status;
            _proc_exit(status);
        }
        var _exit = exitJS;
        function _fd_close(fd) {
            try {
                var stream = SYSCALLS.getStreamFromFD(fd);
                FS.close(stream);
                return 0;
            } catch (e) {
                if (typeof FS == 'undefined' || !(e instanceof FS.ErrnoError))
                    throw e;
                return e.errno;
            }
        }
        function _fd_fdstat_get(fd, pbuf) {
            try {
                var stream = SYSCALLS.getStreamFromFD(fd);
                var type = stream.tty
                    ? 2
                    : FS.isDir(stream.mode)
                    ? 3
                    : FS.isLink(stream.mode)
                    ? 7
                    : 4;
                HEAP8[pbuf >> 0] = type;
                return 0;
            } catch (e) {
                if (typeof FS == 'undefined' || !(e instanceof FS.ErrnoError))
                    throw e;
                return e.errno;
            }
        }
        function doReadv(stream, iov, iovcnt, offset) {
            var ret = 0;
            for (var i = 0; i < iovcnt; i++) {
                var ptr = HEAPU32[iov >> 2];
                var len = HEAPU32[(iov + 4) >> 2];
                iov += 8;
                var curr = FS.read(stream, HEAP8, ptr, len, offset);
                if (curr < 0) return -1;
                ret += curr;
                if (curr < len) break;
            }
            return ret;
        }
        function _fd_read(fd, iov, iovcnt, pnum) {
            try {
                var stream = SYSCALLS.getStreamFromFD(fd);
                var num = doReadv(stream, iov, iovcnt);
                HEAPU32[pnum >> 2] = num;
                return 0;
            } catch (e) {
                if (typeof FS == 'undefined' || !(e instanceof FS.ErrnoError))
                    throw e;
                return e.errno;
            }
        }
        function convertI32PairToI53Checked(lo, hi) {
            return (hi + 2097152) >>> 0 < 4194305 - !!lo
                ? (lo >>> 0) + hi * 4294967296
                : NaN;
        }
        function _fd_seek(fd, offset_low, offset_high, whence, newOffset) {
            try {
                var offset = convertI32PairToI53Checked(
                    offset_low,
                    offset_high
                );
                if (isNaN(offset)) return 61;
                var stream = SYSCALLS.getStreamFromFD(fd);
                FS.llseek(stream, offset, whence);
                (tempI64 = [
                    stream.position >>> 0,
                    ((tempDouble = stream.position),
                    +Math.abs(tempDouble) >= 1
                        ? tempDouble > 0
                            ? (Math.min(
                                  +Math.floor(tempDouble / 4294967296),
                                  4294967295
                              ) |
                                  0) >>>
                              0
                            : ~~+Math.ceil(
                                  (tempDouble - +(~~tempDouble >>> 0)) /
                                      4294967296
                              ) >>> 0
                        : 0),
                ]),
                    (HEAP32[newOffset >> 2] = tempI64[0]),
                    (HEAP32[(newOffset + 4) >> 2] = tempI64[1]);
                if (stream.getdents && offset === 0 && whence === 0)
                    stream.getdents = null;
                return 0;
            } catch (e) {
                if (typeof FS == 'undefined' || !(e instanceof FS.ErrnoError))
                    throw e;
                return e.errno;
            }
        }
        function doWritev(stream, iov, iovcnt, offset) {
            var ret = 0;
            for (var i = 0; i < iovcnt; i++) {
                var ptr = HEAPU32[iov >> 2];
                var len = HEAPU32[(iov + 4) >> 2];
                iov += 8;
                var curr = FS.write(stream, HEAP8, ptr, len, offset);
                if (curr < 0) return -1;
                ret += curr;
            }
            return ret;
        }
        function _fd_write(fd, iov, iovcnt, pnum) {
            try {
                var stream = SYSCALLS.getStreamFromFD(fd);
                var num = doWritev(stream, iov, iovcnt);
                HEAPU32[pnum >> 2] = num;
                return 0;
            } catch (e) {
                if (typeof FS == 'undefined' || !(e instanceof FS.ErrnoError))
                    throw e;
                return e.errno;
            }
        }
        function _getentropy(buffer, size) {
            if (!_getentropy.randomDevice) {
                _getentropy.randomDevice = getRandomDevice();
            }
            for (var i = 0; i < size; i++) {
                HEAP8[(buffer + i) >> 0] = _getentropy.randomDevice();
            }
            return 0;
        }
        function _llvm_eh_typeid_for(type) {
            return type;
        }
        function __isLeapYear(year) {
            return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
        }
        function __arraySum(array, index) {
            var sum = 0;
            for (var i = 0; i <= index; sum += array[i++]) {}
            return sum;
        }
        var __MONTH_DAYS_LEAP = [
            31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31,
        ];
        var __MONTH_DAYS_REGULAR = [
            31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31,
        ];
        function __addDays(date, days) {
            var newDate = new Date(date.getTime());
            while (days > 0) {
                var leap = __isLeapYear(newDate.getFullYear());
                var currentMonth = newDate.getMonth();
                var daysInCurrentMonth = (
                    leap ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR
                )[currentMonth];
                if (days > daysInCurrentMonth - newDate.getDate()) {
                    days -= daysInCurrentMonth - newDate.getDate() + 1;
                    newDate.setDate(1);
                    if (currentMonth < 11) {
                        newDate.setMonth(currentMonth + 1);
                    } else {
                        newDate.setMonth(0);
                        newDate.setFullYear(newDate.getFullYear() + 1);
                    }
                } else {
                    newDate.setDate(newDate.getDate() + days);
                    return newDate;
                }
            }
            return newDate;
        }
        function writeArrayToMemory(array, buffer) {
            HEAP8.set(array, buffer);
        }
        function _strftime(s, maxsize, format, tm) {
            var tm_zone = HEAP32[(tm + 40) >> 2];
            var date = {
                tm_sec: HEAP32[tm >> 2],
                tm_min: HEAP32[(tm + 4) >> 2],
                tm_hour: HEAP32[(tm + 8) >> 2],
                tm_mday: HEAP32[(tm + 12) >> 2],
                tm_mon: HEAP32[(tm + 16) >> 2],
                tm_year: HEAP32[(tm + 20) >> 2],
                tm_wday: HEAP32[(tm + 24) >> 2],
                tm_yday: HEAP32[(tm + 28) >> 2],
                tm_isdst: HEAP32[(tm + 32) >> 2],
                tm_gmtoff: HEAP32[(tm + 36) >> 2],
                tm_zone: tm_zone ? UTF8ToString(tm_zone) : '',
            };
            var pattern = UTF8ToString(format);
            var EXPANSION_RULES_1 = {
                '%c': '%a %b %d %H:%M:%S %Y',
                '%D': '%m/%d/%y',
                '%F': '%Y-%m-%d',
                '%h': '%b',
                '%r': '%I:%M:%S %p',
                '%R': '%H:%M',
                '%T': '%H:%M:%S',
                '%x': '%m/%d/%y',
                '%X': '%H:%M:%S',
                '%Ec': '%c',
                '%EC': '%C',
                '%Ex': '%m/%d/%y',
                '%EX': '%H:%M:%S',
                '%Ey': '%y',
                '%EY': '%Y',
                '%Od': '%d',
                '%Oe': '%e',
                '%OH': '%H',
                '%OI': '%I',
                '%Om': '%m',
                '%OM': '%M',
                '%OS': '%S',
                '%Ou': '%u',
                '%OU': '%U',
                '%OV': '%V',
                '%Ow': '%w',
                '%OW': '%W',
                '%Oy': '%y',
            };
            for (var rule in EXPANSION_RULES_1) {
                pattern = pattern.replace(
                    new RegExp(rule, 'g'),
                    EXPANSION_RULES_1[rule]
                );
            }
            var WEEKDAYS = [
                'Sunday',
                'Monday',
                'Tuesday',
                'Wednesday',
                'Thursday',
                'Friday',
                'Saturday',
            ];
            var MONTHS = [
                'January',
                'February',
                'March',
                'April',
                'May',
                'June',
                'July',
                'August',
                'September',
                'October',
                'November',
                'December',
            ];
            function leadingSomething(value, digits, character) {
                var str =
                    typeof value == 'number' ? value.toString() : value || '';
                while (str.length < digits) {
                    str = character[0] + str;
                }
                return str;
            }
            function leadingNulls(value, digits) {
                return leadingSomething(value, digits, '0');
            }
            function compareByDay(date1, date2) {
                function sgn(value) {
                    return value < 0 ? -1 : value > 0 ? 1 : 0;
                }
                var compare;
                if (
                    (compare = sgn(
                        date1.getFullYear() - date2.getFullYear()
                    )) === 0
                ) {
                    if (
                        (compare = sgn(date1.getMonth() - date2.getMonth())) ===
                        0
                    ) {
                        compare = sgn(date1.getDate() - date2.getDate());
                    }
                }
                return compare;
            }
            function getFirstWeekStartDate(janFourth) {
                switch (janFourth.getDay()) {
                    case 0:
                        return new Date(janFourth.getFullYear() - 1, 11, 29);
                    case 1:
                        return janFourth;
                    case 2:
                        return new Date(janFourth.getFullYear(), 0, 3);
                    case 3:
                        return new Date(janFourth.getFullYear(), 0, 2);
                    case 4:
                        return new Date(janFourth.getFullYear(), 0, 1);
                    case 5:
                        return new Date(janFourth.getFullYear() - 1, 11, 31);
                    case 6:
                        return new Date(janFourth.getFullYear() - 1, 11, 30);
                }
            }
            function getWeekBasedYear(date) {
                var thisDate = __addDays(
                    new Date(date.tm_year + 1900, 0, 1),
                    date.tm_yday
                );
                var janFourthThisYear = new Date(thisDate.getFullYear(), 0, 4);
                var janFourthNextYear = new Date(
                    thisDate.getFullYear() + 1,
                    0,
                    4
                );
                var firstWeekStartThisYear =
                    getFirstWeekStartDate(janFourthThisYear);
                var firstWeekStartNextYear =
                    getFirstWeekStartDate(janFourthNextYear);
                if (compareByDay(firstWeekStartThisYear, thisDate) <= 0) {
                    if (compareByDay(firstWeekStartNextYear, thisDate) <= 0) {
                        return thisDate.getFullYear() + 1;
                    }
                    return thisDate.getFullYear();
                }
                return thisDate.getFullYear() - 1;
            }
            var EXPANSION_RULES_2 = {
                '%a': function (date) {
                    return WEEKDAYS[date.tm_wday].substring(0, 3);
                },
                '%A': function (date) {
                    return WEEKDAYS[date.tm_wday];
                },
                '%b': function (date) {
                    return MONTHS[date.tm_mon].substring(0, 3);
                },
                '%B': function (date) {
                    return MONTHS[date.tm_mon];
                },
                '%C': function (date) {
                    var year = date.tm_year + 1900;
                    return leadingNulls((year / 100) | 0, 2);
                },
                '%d': function (date) {
                    return leadingNulls(date.tm_mday, 2);
                },
                '%e': function (date) {
                    return leadingSomething(date.tm_mday, 2, ' ');
                },
                '%g': function (date) {
                    return getWeekBasedYear(date).toString().substring(2);
                },
                '%G': function (date) {
                    return getWeekBasedYear(date);
                },
                '%H': function (date) {
                    return leadingNulls(date.tm_hour, 2);
                },
                '%I': function (date) {
                    var twelveHour = date.tm_hour;
                    if (twelveHour == 0) twelveHour = 12;
                    else if (twelveHour > 12) twelveHour -= 12;
                    return leadingNulls(twelveHour, 2);
                },
                '%j': function (date) {
                    return leadingNulls(
                        date.tm_mday +
                            __arraySum(
                                __isLeapYear(date.tm_year + 1900)
                                    ? __MONTH_DAYS_LEAP
                                    : __MONTH_DAYS_REGULAR,
                                date.tm_mon - 1
                            ),
                        3
                    );
                },
                '%m': function (date) {
                    return leadingNulls(date.tm_mon + 1, 2);
                },
                '%M': function (date) {
                    return leadingNulls(date.tm_min, 2);
                },
                '%n': function () {
                    return '\n';
                },
                '%p': function (date) {
                    if (date.tm_hour >= 0 && date.tm_hour < 12) {
                        return 'AM';
                    }
                    return 'PM';
                },
                '%S': function (date) {
                    return leadingNulls(date.tm_sec, 2);
                },
                '%t': function () {
                    return '\t';
                },
                '%u': function (date) {
                    return date.tm_wday || 7;
                },
                '%U': function (date) {
                    var days = date.tm_yday + 7 - date.tm_wday;
                    return leadingNulls(Math.floor(days / 7), 2);
                },
                '%V': function (date) {
                    var val = Math.floor(
                        (date.tm_yday + 7 - ((date.tm_wday + 6) % 7)) / 7
                    );
                    if ((date.tm_wday + 371 - date.tm_yday - 2) % 7 <= 2) {
                        val++;
                    }
                    if (!val) {
                        val = 52;
                        var dec31 = (date.tm_wday + 7 - date.tm_yday - 1) % 7;
                        if (
                            dec31 == 4 ||
                            (dec31 == 5 &&
                                __isLeapYear((date.tm_year % 400) - 1))
                        ) {
                            val++;
                        }
                    } else if (val == 53) {
                        var jan1 = (date.tm_wday + 371 - date.tm_yday) % 7;
                        if (
                            jan1 != 4 &&
                            (jan1 != 3 || !__isLeapYear(date.tm_year))
                        )
                            val = 1;
                    }
                    return leadingNulls(val, 2);
                },
                '%w': function (date) {
                    return date.tm_wday;
                },
                '%W': function (date) {
                    var days = date.tm_yday + 7 - ((date.tm_wday + 6) % 7);
                    return leadingNulls(Math.floor(days / 7), 2);
                },
                '%y': function (date) {
                    return (date.tm_year + 1900).toString().substring(2);
                },
                '%Y': function (date) {
                    return date.tm_year + 1900;
                },
                '%z': function (date) {
                    var off = date.tm_gmtoff;
                    var ahead = off >= 0;
                    off = Math.abs(off) / 60;
                    off = (off / 60) * 100 + (off % 60);
                    return (ahead ? '+' : '-') + String('0000' + off).slice(-4);
                },
                '%Z': function (date) {
                    return date.tm_zone;
                },
                '%%': function () {
                    return '%';
                },
            };
            pattern = pattern.replace(/%%/g, '\0\0');
            for (var rule in EXPANSION_RULES_2) {
                if (pattern.includes(rule)) {
                    pattern = pattern.replace(
                        new RegExp(rule, 'g'),
                        EXPANSION_RULES_2[rule](date)
                    );
                }
            }
            pattern = pattern.replace(/\0\0/g, '%');
            var bytes = intArrayFromString(pattern, false);
            if (bytes.length > maxsize) {
                return 0;
            }
            writeArrayToMemory(bytes, s);
            return bytes.length - 1;
        }
        function _strftime_l(s, maxsize, format, tm, loc) {
            return _strftime(s, maxsize, format, tm);
        }
        function handleException(e) {
            if (e instanceof ExitStatus || e == 'unwind') {
                return EXITSTATUS;
            }
            quit_(1, e);
        }
        function allocateUTF8OnStack(str) {
            var size = lengthBytesUTF8(str) + 1;
            var ret = stackAlloc(size);
            stringToUTF8Array(str, HEAP8, ret, size);
            return ret;
        }
        function getCFunc(ident) {
            var func = Module['_' + ident];
            return func;
        }
        function ccall(ident, returnType, argTypes, args, opts) {
            var toC = {
                string: (str) => {
                    var ret = 0;
                    if (str !== null && str !== undefined && str !== 0) {
                        var len = (str.length << 2) + 1;
                        ret = stackAlloc(len);
                        stringToUTF8(str, ret, len);
                    }
                    return ret;
                },
                array: (arr) => {
                    var ret = stackAlloc(arr.length);
                    writeArrayToMemory(arr, ret);
                    return ret;
                },
            };
            function convertReturnValue(ret) {
                if (returnType === 'string') {
                    return UTF8ToString(ret);
                }
                if (returnType === 'boolean') return Boolean(ret);
                return ret;
            }
            var func = getCFunc(ident);
            var cArgs = [];
            var stack = 0;
            if (args) {
                for (var i = 0; i < args.length; i++) {
                    var converter = toC[argTypes[i]];
                    if (converter) {
                        if (stack === 0) stack = stackSave();
                        cArgs[i] = converter(args[i]);
                    } else {
                        cArgs[i] = args[i];
                    }
                }
            }
            var ret = func.apply(null, cArgs);
            function onDone(ret) {
                if (stack !== 0) stackRestore(stack);
                return convertReturnValue(ret);
            }
            ret = onDone(ret);
            return ret;
        }
        function cwrap(ident, returnType, argTypes, opts) {
            argTypes = argTypes || [];
            var numericArgs = argTypes.every(
                (type) => type === 'number' || type === 'boolean'
            );
            var numericRet = returnType !== 'string';
            if (numericRet && numericArgs && !opts) {
                return getCFunc(ident);
            }
            return function () {
                return ccall(ident, returnType, argTypes, arguments, opts);
            };
        }
        var FSNode = function (parent, name, mode, rdev) {
            if (!parent) {
                parent = this;
            }
            this.parent = parent;
            this.mount = parent.mount;
            this.mounted = null;
            this.id = FS.nextInode++;
            this.name = name;
            this.mode = mode;
            this.node_ops = {};
            this.stream_ops = {};
            this.rdev = rdev;
        };
        var readMode = 292 | 73;
        var writeMode = 146;
        Object.defineProperties(FSNode.prototype, {
            read: {
                get: function () {
                    return (this.mode & readMode) === readMode;
                },
                set: function (val) {
                    val ? (this.mode |= readMode) : (this.mode &= ~readMode);
                },
            },
            write: {
                get: function () {
                    return (this.mode & writeMode) === writeMode;
                },
                set: function (val) {
                    val ? (this.mode |= writeMode) : (this.mode &= ~writeMode);
                },
            },
            isFolder: {
                get: function () {
                    return FS.isDir(this.mode);
                },
            },
            isDevice: {
                get: function () {
                    return FS.isChrdev(this.mode);
                },
            },
        });
        FS.FSNode = FSNode;
        FS.staticInit();
        Module['FS_createPath'] = FS.createPath;
        Module['FS_createDataFile'] = FS.createDataFile;
        Module['FS_createPreloadedFile'] = FS.createPreloadedFile;
        Module['FS_unlink'] = FS.unlink;
        Module['FS_createLazyFile'] = FS.createLazyFile;
        Module['FS_createDevice'] = FS.createDevice;
        var asmLibraryArg = {
            g: ___assert_fail,
            Ba: ___call_sighandler,
            h: ___cxa_allocate_exception,
            w: ___cxa_begin_catch,
            jb: ___cxa_call_unexpected,
            ua: ___cxa_current_primary_exception,
            ia: ___cxa_decrement_exception_refcount,
            D: ___cxa_end_catch,
            a: ___cxa_find_matching_catch_2,
            k: ___cxa_find_matching_catch_3,
            s: ___cxa_find_matching_catch_4,
            C: ___cxa_find_matching_catch_5,
            W: ___cxa_find_matching_catch_6,
            ea: ___cxa_find_matching_catch_7,
            m: ___cxa_free_exception,
            T: ___cxa_get_exception_ptr,
            ha: ___cxa_increment_exception_refcount,
            U: ___cxa_rethrow,
            ta: ___cxa_rethrow_primary_exception,
            n: ___cxa_throw,
            va: ___cxa_uncaught_exceptions,
            i: ___resumeException,
            ya: ___syscall__newselect,
            Oa: ___syscall_dup3,
            L: ___syscall_fcntl64,
            Ga: ___syscall_fstat64,
            Ia: ___syscall_getcwd,
            Aa: ___syscall_getdents64,
            Ja: ___syscall_ioctl,
            Da: ___syscall_lstat64,
            Ha: ___syscall_mkdirat,
            Ea: ___syscall_newfstatat,
            oa: ___syscall_openat,
            Ca: ___syscall_pipe,
            za: ___syscall_readlinkat,
            ja: ___syscall_rmdir,
            Fa: ___syscall_stat64,
            ka: ___syscall_unlinkat,
            Ma: __emscripten_get_now_is_monotonic,
            v: _abort,
            P: _emscripten_date_now,
            xa: _emscripten_get_heap_max,
            $: _emscripten_get_now,
            Na: _emscripten_memcpy_big,
            wa: _emscripten_resize_heap,
            Ka: _environ_get,
            La: _environ_sizes_get,
            G: _exit,
            Q: _fd_close,
            la: _fd_fdstat_get,
            ma: _fd_read,
            _a: _fd_seek,
            na: _fd_write,
            kb: _getentropy,
            z: invoke_di,
            I: invoke_dii,
            R: invoke_diii,
            ga: invoke_fiii,
            y: invoke_i,
            c: invoke_ii,
            E: invoke_iid,
            Ua: invoke_iidd,
            qa: invoke_iidddii,
            b: invoke_iii,
            V: invoke_iiidd,
            f: invoke_iiii,
            l: invoke_iiiii,
            sa: invoke_iiiiid,
            o: invoke_iiiiii,
            A: invoke_iiiiiii,
            Pa: invoke_iiiiiiid,
            Y: invoke_iiiiiiii,
            M: invoke_iiiiiiiii,
            da: invoke_iiiiiiiiii,
            _: invoke_iiiiiiiiiiii,
            X: invoke_iiiiiiiiiiiii,
            Xa: invoke_iiiiij,
            gb: invoke_iiiiji,
            hb: invoke_iij,
            eb: invoke_iiji,
            $a: invoke_iijjdj,
            ab: invoke_ijjdji,
            Za: invoke_j,
            ib: invoke_ji,
            db: invoke_jiii,
            Wa: invoke_jiiii,
            fb: invoke_jjj,
            t: invoke_v,
            j: invoke_vi,
            H: invoke_vid,
            ba: invoke_vidd,
            F: invoke_vidi,
            d: invoke_vii,
            J: invoke_viid,
            Ra: invoke_viidd,
            e: invoke_viii,
            N: invoke_viiid,
            q: invoke_viiii,
            O: invoke_viiiid,
            ca: invoke_viiiidd,
            Ta: invoke_viiiidii,
            r: invoke_viiiii,
            Qa: invoke_viiiiidi,
            aa: invoke_viiiiidii,
            p: invoke_viiiiii,
            u: invoke_viiiiiii,
            pa: invoke_viiiiiiidi,
            x: invoke_viiiiiiii,
            S: invoke_viiiiiiiii,
            K: invoke_viiiiiiiiii,
            Va: invoke_viiiiiiiiiii,
            fa: invoke_viiiiiiiiiiii,
            ra: invoke_viiiiiiiiiiiii,
            Z: invoke_viiiiiiiiiiiiiii,
            Sa: invoke_viiiiiiiiiiiiiiidii,
            cb: invoke_viij,
            Ya: invoke_viijii,
            bb: invoke_vij,
            B: _llvm_eh_typeid_for,
            lb: _strftime_l,
        };
        var asm = createWasm();
        var ___wasm_call_ctors = (Module['___wasm_call_ctors'] = function () {
            return (___wasm_call_ctors = Module['___wasm_call_ctors'] =
                Module['asm']['nb']).apply(null, arguments);
        });
        var _main = (Module['_main'] = function () {
            return (_main = Module['_main'] = Module['asm']['ob']).apply(
                null,
                arguments
            );
        });
        var _free = (Module['_free'] = function () {
            return (_free = Module['_free'] = Module['asm']['qb']).apply(
                null,
                arguments
            );
        });
        var _malloc = (Module['_malloc'] = function () {
            return (_malloc = Module['_malloc'] = Module['asm']['rb']).apply(
                null,
                arguments
            );
        });
        var ___errno_location = (Module['___errno_location'] = function () {
            return (___errno_location = Module['___errno_location'] =
                Module['asm']['sb']).apply(null, arguments);
        });
        var _setThrew = (Module['_setThrew'] = function () {
            return (_setThrew = Module['_setThrew'] =
                Module['asm']['tb']).apply(null, arguments);
        });
        var setTempRet0 = (Module['setTempRet0'] = function () {
            return (setTempRet0 = Module['setTempRet0'] =
                Module['asm']['ub']).apply(null, arguments);
        });
        var stackSave = (Module['stackSave'] = function () {
            return (stackSave = Module['stackSave'] =
                Module['asm']['vb']).apply(null, arguments);
        });
        var stackRestore = (Module['stackRestore'] = function () {
            return (stackRestore = Module['stackRestore'] =
                Module['asm']['wb']).apply(null, arguments);
        });
        var stackAlloc = (Module['stackAlloc'] = function () {
            return (stackAlloc = Module['stackAlloc'] =
                Module['asm']['xb']).apply(null, arguments);
        });
        var ___cxa_can_catch = (Module['___cxa_can_catch'] = function () {
            return (___cxa_can_catch = Module['___cxa_can_catch'] =
                Module['asm']['yb']).apply(null, arguments);
        });
        var ___cxa_is_pointer_type = (Module['___cxa_is_pointer_type'] =
            function () {
                return (___cxa_is_pointer_type = Module[
                    '___cxa_is_pointer_type'
                ] =
                    Module['asm']['zb']).apply(null, arguments);
            });
        var dynCall_ji = (Module['dynCall_ji'] = function () {
            return (dynCall_ji = Module['dynCall_ji'] =
                Module['asm']['Ab']).apply(null, arguments);
        });
        var dynCall_iiiiji = (Module['dynCall_iiiiji'] = function () {
            return (dynCall_iiiiji = Module['dynCall_iiiiji'] =
                Module['asm']['Bb']).apply(null, arguments);
        });
        var dynCall_jjj = (Module['dynCall_jjj'] = function () {
            return (dynCall_jjj = Module['dynCall_jjj'] =
                Module['asm']['Cb']).apply(null, arguments);
        });
        var dynCall_iij = (Module['dynCall_iij'] = function () {
            return (dynCall_iij = Module['dynCall_iij'] =
                Module['asm']['Db']).apply(null, arguments);
        });
        var dynCall_iiji = (Module['dynCall_iiji'] = function () {
            return (dynCall_iiji = Module['dynCall_iiji'] =
                Module['asm']['Eb']).apply(null, arguments);
        });
        var dynCall_jiii = (Module['dynCall_jiii'] = function () {
            return (dynCall_jiii = Module['dynCall_jiii'] =
                Module['asm']['Fb']).apply(null, arguments);
        });
        var dynCall_viij = (Module['dynCall_viij'] = function () {
            return (dynCall_viij = Module['dynCall_viij'] =
                Module['asm']['Gb']).apply(null, arguments);
        });
        var dynCall_vij = (Module['dynCall_vij'] = function () {
            return (dynCall_vij = Module['dynCall_vij'] =
                Module['asm']['Hb']).apply(null, arguments);
        });
        var dynCall_ijjdji = (Module['dynCall_ijjdji'] = function () {
            return (dynCall_ijjdji = Module['dynCall_ijjdji'] =
                Module['asm']['Ib']).apply(null, arguments);
        });
        var dynCall_iijjdj = (Module['dynCall_iijjdj'] = function () {
            return (dynCall_iijjdj = Module['dynCall_iijjdj'] =
                Module['asm']['Jb']).apply(null, arguments);
        });
        var dynCall_j = (Module['dynCall_j'] = function () {
            return (dynCall_j = Module['dynCall_j'] =
                Module['asm']['Kb']).apply(null, arguments);
        });
        var dynCall_viijii = (Module['dynCall_viijii'] = function () {
            return (dynCall_viijii = Module['dynCall_viijii'] =
                Module['asm']['Lb']).apply(null, arguments);
        });
        var dynCall_iiiiij = (Module['dynCall_iiiiij'] = function () {
            return (dynCall_iiiiij = Module['dynCall_iiiiij'] =
                Module['asm']['Mb']).apply(null, arguments);
        });
        var dynCall_jiiii = (Module['dynCall_jiiii'] = function () {
            return (dynCall_jiiii = Module['dynCall_jiiii'] =
                Module['asm']['Nb']).apply(null, arguments);
        });
        function invoke_iii(index, a1, a2) {
            var sp = stackSave();
            try {
                return getWasmTableEntry(index)(a1, a2);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0) throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_iiiiii(index, a1, a2, a3, a4, a5) {
            var sp = stackSave();
            try {
                return getWasmTableEntry(index)(a1, a2, a3, a4, a5);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0) throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_iiiii(index, a1, a2, a3, a4) {
            var sp = stackSave();
            try {
                return getWasmTableEntry(index)(a1, a2, a3, a4);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0) throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_ii(index, a1) {
            var sp = stackSave();
            try {
                return getWasmTableEntry(index)(a1);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0) throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_iiii(index, a1, a2, a3) {
            var sp = stackSave();
            try {
                return getWasmTableEntry(index)(a1, a2, a3);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0) throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_vii(index, a1, a2) {
            var sp = stackSave();
            try {
                getWasmTableEntry(index)(a1, a2);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0) throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_v(index) {
            var sp = stackSave();
            try {
                getWasmTableEntry(index)();
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0) throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_vi(index, a1) {
            var sp = stackSave();
            try {
                getWasmTableEntry(index)(a1);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0) throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_iid(index, a1, a2) {
            var sp = stackSave();
            try {
                return getWasmTableEntry(index)(a1, a2);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0) throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_iiiiiii(index, a1, a2, a3, a4, a5, a6) {
            var sp = stackSave();
            try {
                return getWasmTableEntry(index)(a1, a2, a3, a4, a5, a6);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0) throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_viii(index, a1, a2, a3) {
            var sp = stackSave();
            try {
                getWasmTableEntry(index)(a1, a2, a3);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0) throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_viiii(index, a1, a2, a3, a4) {
            var sp = stackSave();
            try {
                getWasmTableEntry(index)(a1, a2, a3, a4);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0) throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_i(index) {
            var sp = stackSave();
            try {
                return getWasmTableEntry(index)();
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0) throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_viiiiiii(index, a1, a2, a3, a4, a5, a6, a7) {
            var sp = stackSave();
            try {
                getWasmTableEntry(index)(a1, a2, a3, a4, a5, a6, a7);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0) throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_viiiiii(index, a1, a2, a3, a4, a5, a6) {
            var sp = stackSave();
            try {
                getWasmTableEntry(index)(a1, a2, a3, a4, a5, a6);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0) throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_viiiii(index, a1, a2, a3, a4, a5) {
            var sp = stackSave();
            try {
                getWasmTableEntry(index)(a1, a2, a3, a4, a5);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0) throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_di(index, a1) {
            var sp = stackSave();
            try {
                return getWasmTableEntry(index)(a1);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0) throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_viiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8) {
            var sp = stackSave();
            try {
                getWasmTableEntry(index)(a1, a2, a3, a4, a5, a6, a7, a8);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0) throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_iiiiiiii(index, a1, a2, a3, a4, a5, a6, a7) {
            var sp = stackSave();
            try {
                return getWasmTableEntry(index)(a1, a2, a3, a4, a5, a6, a7);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0) throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_viiiiiiiiiii(
            index,
            a1,
            a2,
            a3,
            a4,
            a5,
            a6,
            a7,
            a8,
            a9,
            a10,
            a11
        ) {
            var sp = stackSave();
            try {
                getWasmTableEntry(index)(
                    a1,
                    a2,
                    a3,
                    a4,
                    a5,
                    a6,
                    a7,
                    a8,
                    a9,
                    a10,
                    a11
                );
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0) throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_viiiiiiiiiiii(
            index,
            a1,
            a2,
            a3,
            a4,
            a5,
            a6,
            a7,
            a8,
            a9,
            a10,
            a11,
            a12
        ) {
            var sp = stackSave();
            try {
                getWasmTableEntry(index)(
                    a1,
                    a2,
                    a3,
                    a4,
                    a5,
                    a6,
                    a7,
                    a8,
                    a9,
                    a10,
                    a11,
                    a12
                );
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0) throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_viiiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8, a9) {
            var sp = stackSave();
            try {
                getWasmTableEntry(index)(a1, a2, a3, a4, a5, a6, a7, a8, a9);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0) throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_viiiiiiiiii(
            index,
            a1,
            a2,
            a3,
            a4,
            a5,
            a6,
            a7,
            a8,
            a9,
            a10
        ) {
            var sp = stackSave();
            try {
                getWasmTableEntry(index)(
                    a1,
                    a2,
                    a3,
                    a4,
                    a5,
                    a6,
                    a7,
                    a8,
                    a9,
                    a10
                );
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0) throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_viiiiiiiiiiiii(
            index,
            a1,
            a2,
            a3,
            a4,
            a5,
            a6,
            a7,
            a8,
            a9,
            a10,
            a11,
            a12,
            a13
        ) {
            var sp = stackSave();
            try {
                getWasmTableEntry(index)(
                    a1,
                    a2,
                    a3,
                    a4,
                    a5,
                    a6,
                    a7,
                    a8,
                    a9,
                    a10,
                    a11,
                    a12,
                    a13
                );
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0) throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_iiiiiiiiiiiii(
            index,
            a1,
            a2,
            a3,
            a4,
            a5,
            a6,
            a7,
            a8,
            a9,
            a10,
            a11,
            a12
        ) {
            var sp = stackSave();
            try {
                return getWasmTableEntry(index)(
                    a1,
                    a2,
                    a3,
                    a4,
                    a5,
                    a6,
                    a7,
                    a8,
                    a9,
                    a10,
                    a11,
                    a12
                );
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0) throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_iiiiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8, a9) {
            var sp = stackSave();
            try {
                return getWasmTableEntry(index)(
                    a1,
                    a2,
                    a3,
                    a4,
                    a5,
                    a6,
                    a7,
                    a8,
                    a9
                );
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0) throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_viiiidd(index, a1, a2, a3, a4, a5, a6) {
            var sp = stackSave();
            try {
                getWasmTableEntry(index)(a1, a2, a3, a4, a5, a6);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0) throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_viid(index, a1, a2, a3) {
            var sp = stackSave();
            try {
                getWasmTableEntry(index)(a1, a2, a3);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0) throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_vidd(index, a1, a2, a3) {
            var sp = stackSave();
            try {
                getWasmTableEntry(index)(a1, a2, a3);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0) throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_iidd(index, a1, a2, a3) {
            var sp = stackSave();
            try {
                return getWasmTableEntry(index)(a1, a2, a3);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0) throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_viiiid(index, a1, a2, a3, a4, a5) {
            var sp = stackSave();
            try {
                getWasmTableEntry(index)(a1, a2, a3, a4, a5);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0) throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_viiid(index, a1, a2, a3, a4) {
            var sp = stackSave();
            try {
                getWasmTableEntry(index)(a1, a2, a3, a4);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0) throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_iiiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8) {
            var sp = stackSave();
            try {
                return getWasmTableEntry(index)(a1, a2, a3, a4, a5, a6, a7, a8);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0) throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_dii(index, a1, a2) {
            var sp = stackSave();
            try {
                return getWasmTableEntry(index)(a1, a2);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0) throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_vid(index, a1, a2) {
            var sp = stackSave();
            try {
                getWasmTableEntry(index)(a1, a2);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0) throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_iiidd(index, a1, a2, a3, a4) {
            var sp = stackSave();
            try {
                return getWasmTableEntry(index)(a1, a2, a3, a4);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0) throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_viiiidii(index, a1, a2, a3, a4, a5, a6, a7) {
            var sp = stackSave();
            try {
                getWasmTableEntry(index)(a1, a2, a3, a4, a5, a6, a7);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0) throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_vidi(index, a1, a2, a3) {
            var sp = stackSave();
            try {
                getWasmTableEntry(index)(a1, a2, a3);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0) throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_viiiiiiiiiiiiiiidii(
            index,
            a1,
            a2,
            a3,
            a4,
            a5,
            a6,
            a7,
            a8,
            a9,
            a10,
            a11,
            a12,
            a13,
            a14,
            a15,
            a16,
            a17,
            a18
        ) {
            var sp = stackSave();
            try {
                getWasmTableEntry(index)(
                    a1,
                    a2,
                    a3,
                    a4,
                    a5,
                    a6,
                    a7,
                    a8,
                    a9,
                    a10,
                    a11,
                    a12,
                    a13,
                    a14,
                    a15,
                    a16,
                    a17,
                    a18
                );
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0) throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_diii(index, a1, a2, a3) {
            var sp = stackSave();
            try {
                return getWasmTableEntry(index)(a1, a2, a3);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0) throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_iidddii(index, a1, a2, a3, a4, a5, a6) {
            var sp = stackSave();
            try {
                return getWasmTableEntry(index)(a1, a2, a3, a4, a5, a6);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0) throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_viiiiiiidi(index, a1, a2, a3, a4, a5, a6, a7, a8, a9) {
            var sp = stackSave();
            try {
                getWasmTableEntry(index)(a1, a2, a3, a4, a5, a6, a7, a8, a9);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0) throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_viidd(index, a1, a2, a3, a4) {
            var sp = stackSave();
            try {
                getWasmTableEntry(index)(a1, a2, a3, a4);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0) throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_viiiiidii(index, a1, a2, a3, a4, a5, a6, a7, a8) {
            var sp = stackSave();
            try {
                getWasmTableEntry(index)(a1, a2, a3, a4, a5, a6, a7, a8);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0) throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_viiiiidi(index, a1, a2, a3, a4, a5, a6, a7) {
            var sp = stackSave();
            try {
                getWasmTableEntry(index)(a1, a2, a3, a4, a5, a6, a7);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0) throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_iiiiiiid(index, a1, a2, a3, a4, a5, a6, a7) {
            var sp = stackSave();
            try {
                return getWasmTableEntry(index)(a1, a2, a3, a4, a5, a6, a7);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0) throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_iiiiid(index, a1, a2, a3, a4, a5) {
            var sp = stackSave();
            try {
                return getWasmTableEntry(index)(a1, a2, a3, a4, a5);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0) throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_fiii(index, a1, a2, a3) {
            var sp = stackSave();
            try {
                return getWasmTableEntry(index)(a1, a2, a3);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0) throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_iiiiiiiiiiii(
            index,
            a1,
            a2,
            a3,
            a4,
            a5,
            a6,
            a7,
            a8,
            a9,
            a10,
            a11
        ) {
            var sp = stackSave();
            try {
                return getWasmTableEntry(index)(
                    a1,
                    a2,
                    a3,
                    a4,
                    a5,
                    a6,
                    a7,
                    a8,
                    a9,
                    a10,
                    a11
                );
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0) throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_viiiiiiiiiiiiiii(
            index,
            a1,
            a2,
            a3,
            a4,
            a5,
            a6,
            a7,
            a8,
            a9,
            a10,
            a11,
            a12,
            a13,
            a14,
            a15
        ) {
            var sp = stackSave();
            try {
                getWasmTableEntry(index)(
                    a1,
                    a2,
                    a3,
                    a4,
                    a5,
                    a6,
                    a7,
                    a8,
                    a9,
                    a10,
                    a11,
                    a12,
                    a13,
                    a14,
                    a15
                );
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0) throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_ji(index, a1) {
            var sp = stackSave();
            try {
                return dynCall_ji(index, a1);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0) throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_iij(index, a1, a2, a3) {
            var sp = stackSave();
            try {
                return dynCall_iij(index, a1, a2, a3);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0) throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_iiiiji(index, a1, a2, a3, a4, a5, a6) {
            var sp = stackSave();
            try {
                return dynCall_iiiiji(index, a1, a2, a3, a4, a5, a6);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0) throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_jjj(index, a1, a2, a3, a4) {
            var sp = stackSave();
            try {
                return dynCall_jjj(index, a1, a2, a3, a4);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0) throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_iiji(index, a1, a2, a3, a4) {
            var sp = stackSave();
            try {
                return dynCall_iiji(index, a1, a2, a3, a4);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0) throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_jiii(index, a1, a2, a3) {
            var sp = stackSave();
            try {
                return dynCall_jiii(index, a1, a2, a3);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0) throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_viij(index, a1, a2, a3, a4) {
            var sp = stackSave();
            try {
                dynCall_viij(index, a1, a2, a3, a4);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0) throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_vij(index, a1, a2, a3) {
            var sp = stackSave();
            try {
                dynCall_vij(index, a1, a2, a3);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0) throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_ijjdji(index, a1, a2, a3, a4, a5, a6, a7, a8) {
            var sp = stackSave();
            try {
                return dynCall_ijjdji(index, a1, a2, a3, a4, a5, a6, a7, a8);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0) throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_iijjdj(index, a1, a2, a3, a4, a5, a6, a7, a8) {
            var sp = stackSave();
            try {
                return dynCall_iijjdj(index, a1, a2, a3, a4, a5, a6, a7, a8);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0) throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_j(index) {
            var sp = stackSave();
            try {
                return dynCall_j(index);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0) throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_viijii(index, a1, a2, a3, a4, a5, a6) {
            var sp = stackSave();
            try {
                dynCall_viijii(index, a1, a2, a3, a4, a5, a6);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0) throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_iiiiij(index, a1, a2, a3, a4, a5, a6) {
            var sp = stackSave();
            try {
                return dynCall_iiiiij(index, a1, a2, a3, a4, a5, a6);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0) throw e;
                _setThrew(1, 0);
            }
        }
        function invoke_jiiii(index, a1, a2, a3, a4) {
            var sp = stackSave();
            try {
                return dynCall_jiiii(index, a1, a2, a3, a4);
            } catch (e) {
                stackRestore(sp);
                if (e !== e + 0) throw e;
                _setThrew(1, 0);
            }
        }
        Module['addRunDependency'] = addRunDependency;
        Module['removeRunDependency'] = removeRunDependency;
        Module['FS_createPath'] = FS.createPath;
        Module['FS_createDataFile'] = FS.createDataFile;
        Module['FS_createPreloadedFile'] = FS.createPreloadedFile;
        Module['FS_createLazyFile'] = FS.createLazyFile;
        Module['FS_createDevice'] = FS.createDevice;
        Module['FS_unlink'] = FS.unlink;
        Module['callMain'] = callMain;
        Module['ENV'] = ENV;
        Module['cwrap'] = cwrap;
        Module['FS'] = FS;
        Module['LZ4'] = LZ4;
        var calledRun;
        dependenciesFulfilled = function runCaller() {
            if (!calledRun) run();
            if (!calledRun) dependenciesFulfilled = runCaller;
        };
        function callMain(args) {
            var entryFunction = Module['_main'];
            args = args || [];
            args.unshift(thisProgram);
            var argc = args.length;
            var argv = stackAlloc((argc + 1) * 4);
            var argv_ptr = argv >> 2;
            args.forEach((arg) => {
                HEAP32[argv_ptr++] = allocateUTF8OnStack(arg);
            });
            HEAP32[argv_ptr] = 0;
            try {
                var ret = entryFunction(argc, argv);
                exitJS(ret, true);
                return ret;
            } catch (e) {
                return handleException(e);
            }
        }
        function run(args) {
            args = args || arguments_;
            if (runDependencies > 0) {
                return;
            }
            preRun();
            if (runDependencies > 0) {
                return;
            }
            function doRun() {
                if (calledRun) return;
                calledRun = true;
                Module['calledRun'] = true;
                if (ABORT) return;
                initRuntime();
                preMain();
                readyPromiseResolve(Module);
                if (Module['onRuntimeInitialized'])
                    Module['onRuntimeInitialized']();
                if (shouldRunNow) callMain(args);
                postRun();
            }
            if (Module['setStatus']) {
                Module['setStatus']('Running...');
                setTimeout(function () {
                    setTimeout(function () {
                        Module['setStatus']('');
                    }, 1);
                    doRun();
                }, 1);
            } else {
                doRun();
            }
        }
        if (Module['preInit']) {
            if (typeof Module['preInit'] == 'function')
                Module['preInit'] = [Module['preInit']];
            while (Module['preInit'].length > 0) {
                Module['preInit'].pop()();
            }
        }
        var shouldRunNow = true;
        if (Module['noInitialRun']) shouldRunNow = false;
        run();

        return MINIZINC.ready;
    };
})();
if (typeof exports === 'object' && typeof module === 'object')
    module.exports = MINIZINC;
else if (typeof define === 'function' && define['amd'])
    define([], function () {
        return MINIZINC;
    });
else if (typeof exports === 'object') exports['MINIZINC'] = MINIZINC;

if (typeof importScripts == 'function') {
    // We're a web worker, so load the wasm file
    const ready = MINIZINC({
        preRun: [
            (Module) => {
                const stdout = (code) => {
                    const char = String.fromCharCode(code);
                    Module.stdoutBuffer += char;
                    if (Module.jsonStream && char === '\n') {
                        try {
                            // Send the JSON stream message
                            const obj = JSON.parse(Module.stdoutBuffer);
                            if (
                                'location' in obj &&
                                'filename' in obj.location &&
                                obj.location.filename.indexOf('/minizinc/') ===
                                    0
                            ) {
                                // Strip prefix from filename
                                obj.location.filename =
                                    obj.location.filename.substring(10);
                            }
                            postMessage(obj);
                        } catch (e) {
                            // Fall back to creating a stdout message
                            postMessage({
                                type: 'stdout',
                                value: Module.stdoutBuffer,
                            });
                        }
                        Module.stdoutBuffer = '';
                    }
                };
                const stderr = (code) => {
                    const char = String.fromCharCode(code);
                    Module.stderrBuffer += char;
                    if (Module.jsonStream && char === '\n') {
                        // Send as a stderr message
                        postMessage({
                            type: 'stderr',
                            value: Module.stderrBuffer,
                        });
                        Module.stderrBuffer = '';
                    }
                };
                Module.FS.init(null, stdout, stderr);
                Module.FS.mkdir('/minizinc');
            },
        ],
        noInitialRun: true,
        noExitRuntime: true,
    });

    // When a message is received from the controller, run minizinc accordingly
    addEventListener('message', async (e) => {
        const Module = await ready;
        Module.stdoutBuffer = '';
        Module.stderrBuffer = '';
        Module.jsonStream = !!e.data.jsonStream;
        Module.FS.mount(Module.FS.filesystems.MEMFS, null, '/minizinc');
        if (e.data.files) {
            const prefix = 'file:///minizinc/';
            for (const key in e.data.files) {
                const resolved = new URL(prefix + key).href;
                if (resolved.indexOf(prefix) !== 0) {
                    // Ensure path is a valid relative path
                    throw new Error(`Unsupported file path ${key}`);
                }
                const dest = '/minizinc/' + resolved.substring(prefix.length);
                for (let i = 0; i != -1; i = dest.indexOf('/', i + 1)) {
                    // Create parent paths
                    const path = dest.substring(0, i);
                    if (!Module.FS.analyzePath(path).exists) {
                        Module.FS.mkdir(path);
                    }
                }
                // Write file
                Module.FS.writeFile(dest, e.data.files[key]);
            }
        }
        // Always include --json-stream
        const args = Module.jsonStream
            ? ['--json-stream', ...e.data.args]
            : e.data.args;
        const oldCwd = Module.FS.cwd();
        Module.FS.chdir('/minizinc');
        const code = Module.callMain(args);
        // Add exit message so the controller can tell that we're done
        const exitMessage = { type: 'exit', code };
        if (Module.stdoutBuffer.length > 0) {
            exitMessage.stdout = Module.stdoutBuffer;
        }
        if (Module.stderrBuffer.length > 0) {
            exitMessage.stderr = Module.stderrBuffer;
        }
        if (e.data.outputFiles) {
            exitMessage.outputFiles = {};
            const prefix = 'file:///minizinc/';
            for (const key of e.data.outputFiles) {
                const resolved = new URL(prefix + key).href;
                if (resolved.indexOf(prefix) !== 0) {
                    // Ensure path is a valid relative path
                    throw new Error(`Unsupported file path ${key}`);
                }
                const path = '/minizinc/' + resolved.substring(prefix.length);
                if (Module.FS.analyzePath(path).exists) {
                    exitMessage.outputFiles[key] = Module.FS.readFile(path, {
                        encoding: 'utf8',
                    });
                } else {
                    exitMessage.outputFiles[key] = null;
                }
            }
        }
        postMessage(exitMessage);
        Module.FS.chdir(oldCwd);
        Module.FS.unmount('/minizinc');
    });
} else {
    const src =
        typeof document !== 'undefined' && document.currentScript
            ? document.currentScript.src
            : undefined;
    if (src) {
        const workers = [
            { worker: new Worker(src), runCount: 0 },
            { worker: new Worker(src), runCount: 0 },
        ];
        // We're in a webpage
        class Model {
            constructor() {
                this.vfs = {};
                this.toRun = [];
                this.unnamedCount = 0;
            }
            addString(model) {
                let filename = `_mzn_${this.unnamedCount++}.mzn`;
                while (filename in this.vfs) {
                    filename = `_mzn_${this.unnamedCount++}.mzn`;
                }
                this.addFile(filename, model);
            }
            addFile(filename, contents, use = true) {
                this.vfs[filename] = contents;
                if (
                    use &&
                    (filename.endsWith('.mzn') ||
                        filename.endsWith('.dzn') ||
                        filename.endsWith('.json') ||
                        filename.endsWith('.mpc'))
                ) {
                    this.toRun.push(filename);
                }
            }
            _run(args, options, outputFiles = null) {
                let mpcFile = `_mzn_${this.unnamedCount++}.mpc`;
                while (mpcFile in this.vfs) {
                    mpcFile = `_mzn_${this.unnamedCount++}.mpc`;
                }
                const vfs = { ...this.vfs, [mpcFile]: JSON.stringify(options) };
                while (workers.length < 2) {
                    workers.push({ worker: new Worker(src), runCount: 0 });
                }
                let { worker, runCount } = workers.pop();
                worker.postMessage({
                    jsonStream: true,
                    files: vfs,
                    args: [mpcFile, ...args, ...this.toRun],
                    outputFiles,
                });
                return { worker, runCount: runCount + 1 };
            }
            check(options) {
                return new Promise((resolve, _reject) => {
                    const { worker, runCount } = this._run(
                        ['--model-check-only'],
                        options
                    );
                    const errors = [];
                    worker.onmessage = (e) => {
                        switch (e.data.type) {
                            case 'error':
                                errors.push(e.data);
                                break;
                            case 'exit':
                                if (runCount < 10) {
                                    workers.push({
                                        worker,
                                        runCount,
                                    });
                                } else {
                                    workers.push({
                                        worker: new Worker(src),
                                        runCount: 0,
                                    });
                                }
                                resolve(errors);
                                break;
                        }
                    };
                });
            }
            interface(options) {
                return new Promise((resolve, reject) => {
                    const { worker, runCount } = this._run(
                        ['-c', '--model-interface-only'],
                        options
                    );
                    const errors = [];
                    let iface = null;
                    worker.onmessage = (e) => {
                        switch (e.data.type) {
                            case 'error':
                                errors.push(e.data);
                                break;
                            case 'interface':
                                iface = e.data;
                                break;
                            case 'exit':
                                if (runCount < 10) {
                                    workers.push({
                                        worker,
                                        runCount,
                                    });
                                } else {
                                    workers.push({
                                        worker: new Worker(src),
                                        runCount: 0,
                                    });
                                }
                                if (e.data.code === 0) {
                                    resolve(iface);
                                } else {
                                    reject(errors);
                                }
                                break;
                        }
                    };
                });
            }
            compile(options) {
                let i = 0;
                let out = `_fzn_${i++}.fzn`;
                while (out in this.vfs) {
                    out = `_fzn_${i++}.fzn`;
                }
                const args = ['-c', '--fzn', out];
                const { worker } = this._run(args, options, [out]);
                // Don't reuse this worker, always create add a new one to the pool
                workers.push({
                    worker: new Worker(src),
                    runCount: 0,
                });
                let callbacks = {};
                let exited = false;
                let statistics = {};
                worker.onmessage = (e) => {
                    if (callbacks[e.data.type]) {
                        for (const f of callbacks[e.data.type]) {
                            f(e.data);
                        }
                    }
                    switch (e.data.type) {
                        case 'exit':
                            exited = true;
                            callbacks = {};
                            break;
                        case 'statistics':
                            statistics = {
                                ...statistics,
                                ...e.data.statistics,
                            };
                            break;
                    }
                };
                return {
                    cancel() {
                        if (!exited) {
                            exited = true;
                            worker.terminate();
                            if (callbacks['exit']) {
                                for (const f of callbacks['exit']) {
                                    f({ statistics });
                                }
                            }
                            callbacks = {};
                        }
                    },
                    on(event, callback) {
                        if (callbacks[event]) {
                            callbacks[event].add(callback);
                        } else {
                            callbacks[event] = new Set([callback]);
                        }
                    },
                    off(event, callback) {
                        if (callbacks[event]) {
                            callbacks[event].delete(callback);
                        }
                    },
                    then(resolve, reject) {
                        const onExit = (e) => {
                            if (e.code === 0) {
                                resolve(e.outputFiles[out]);
                            } else {
                                reject(e);
                            }
                        };
                        if (callbacks.exit) {
                            callbacks.exit.add(onExit);
                        } else {
                            callbacks.exit = new Set([onExit]);
                        }
                    },
                };
            }
            solve(options, jsonOutput = true) {
                const args = ['-i', '-s'];
                if (jsonOutput) {
                    args.push('--output-mode');
                    args.push('json');
                }
                const { worker } = this._run(args, options);
                // Don't reuse this worker, always create add a new one to the pool
                workers.push({
                    worker: new Worker(src),
                    runCount: 0,
                });
                let callbacks = {};
                let exited = false;
                let solution = null;
                let statistics = {};
                let status = 'UNKNOWN';
                worker.onmessage = (e) => {
                    if (callbacks[e.data.type]) {
                        for (const f of callbacks[e.data.type]) {
                            f(e.data);
                        }
                    }
                    switch (e.data.type) {
                        case 'exit':
                            exited = true;
                            callbacks = {};
                            break;
                        case 'statistics':
                            statistics = {
                                ...statistics,
                                ...e.data.statistics,
                            };
                            break;
                        case 'solution':
                            solution = e.data;
                            status = 'SATISFIED';
                            break;
                        case 'status':
                            status = e.data.status;
                            break;
                    }
                };
                return {
                    cancel() {
                        if (!exited) {
                            exited = true;
                            worker.terminate();
                            if (callbacks['exit']) {
                                for (const f of callbacks['exit']) {
                                    f({ status, solution, statistics });
                                }
                            }
                            callbacks = {};
                        }
                    },
                    on(event, callback) {
                        if (callbacks[event]) {
                            callbacks[event].add(callback);
                        } else {
                            callbacks[event] = new Set([callback]);
                        }
                    },
                    off(event, callback) {
                        if (callbacks[event]) {
                            callbacks[event].delete(callback);
                        }
                    },
                    then(resolve, reject) {
                        const onExit = (e) => {
                            if (e.code === 0) {
                                resolve({
                                    status,
                                    solution,
                                    statistics,
                                });
                            } else {
                                reject(e);
                            }
                        };
                        if (callbacks.exit) {
                            callbacks.exit.add(onExit);
                        } else {
                            callbacks.exit = new Set([onExit]);
                        }
                    },
                };
            }
        }

        const version = () => {
            return new Promise((resolve, reject) => {
                while (workers.length < 2) {
                    workers.push({ worker: new Worker(src), runCount: 0 });
                }
                let { worker, runCount } = workers.pop();
                worker.postMessage({
                    jsonStream: false,
                    args: ['--version'],
                });
                worker.onmessage = (e) => {
                    if (e.data.type === 'exit') {
                        if (e.data.code === 0) {
                            resolve(e.data.stdout);
                        } else {
                            reject(e.data);
                        }
                    }
                };
            });
        };

        window.MiniZinc = {
            Model,
            version,
        };
    }
}
