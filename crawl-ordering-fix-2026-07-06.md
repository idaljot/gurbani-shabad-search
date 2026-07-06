# Crawl ordering fix — affected shabads

Generated 2026-07-06 while fixing the line-ordering race condition in `scripts/fetch-base.mjs` (see commit 1a3d03c, "Fix line-ordering race in base crawl").

At concurrency 8, Angs completed fetching in nondeterministic order, so a shabad whose lines span an Ang boundary could have its lines assembled out of order and its `ang` field set to whichever Ang happened to finish first. After the fix, the crawl was re-run twice independently and produced byte-identical output both times (verified separately).

Comparing the fixed crawl against the previously-committed `shabads.json`, **607 shabads** changed (297 in Guru Granth Sahib Ji, 310 in Sri Dasam Granth, 0 in the smaller sources). **None of them had any notation attached** (checked explicitly — this was the whole risk the fix exists to prevent).

| Shabad ID | Source | Old Ang | New (correct) Ang | Had notation |
|---|---|---|---|---|
| 05J | Sri Dasam Granth | 1252 | 1251 | no |
| 069 | Sri Dasam Granth | 1325 | 1324 | no |
| 06S | Sri Dasam Granth | 1425 | 1424 | no |
| 087 | Guru Granth Sahib Ji | 825 | 824 | no |
| 0AU | Sri Dasam Granth | 1329 | 1328 | no |
| 0EM | Sri Dasam Granth | 488 | 487 | no |
| 0G7 | Guru Granth Sahib Ji | 678 | 677 | no |
| 0HB | Guru Granth Sahib Ji | 375 | 374 | no |
| 0L9 | Sri Dasam Granth | 220 | 219 | no |
| 0MG | Sri Dasam Granth | 1222 | 1221 | no |
| 0MS | Sri Dasam Granth | 380 | 379 | no |
| 0RV | Guru Granth Sahib Ji | 954 | 953 | no |
| 0VC | Sri Dasam Granth | 1387 | 1386 | no |
| 0VP | Sri Dasam Granth | 611 | 610 | no |
| 0YL | Guru Granth Sahib Ji | 1400 | 1399 | no |
| 110 | Guru Granth Sahib Ji | 1357 | 1356 | no |
| 111 | Sri Dasam Granth | 190 | 189 | no |
| 114 | Sri Dasam Granth | 290 | 289 | no |
| 19C | Sri Dasam Granth | 388 | 387 | no |
| 1A6 | Sri Dasam Granth | 1256 | 1255 | no |
| 1AE | Guru Granth Sahib Ji | 1185 | 1184 | no |
| 1B1 | Sri Dasam Granth | 864 | 863 | no |
| 1BX | Sri Dasam Granth | 1239 | 1238 | no |
| 1CB | Guru Granth Sahib Ji | 1009 | 1008 | no |
| 1CK | Sri Dasam Granth | 326 | 326 | no |
| 1DV | Guru Granth Sahib Ji | 562 | 561 | no |
| 1E5 | Guru Granth Sahib Ji | 1052 | 1051 | no |
| 1G6 | Sri Dasam Granth | 470 | 469 | no |
| 1J7 | Sri Dasam Granth | 692 | 691 | no |
| 1K3 | Sri Dasam Granth | 684 | 683 | no |
| 1KJ | Guru Granth Sahib Ji | 576 | 575 | no |
| 1LT | Guru Granth Sahib Ji | 1128 | 1127 | no |
| 1ND | Sri Dasam Granth | 383 | 382 | no |
| 1SB | Sri Dasam Granth | 85 | 84 | no |
| 1VN | Sri Dasam Granth | 1012 | 1011 | no |
| 1YZ | Sri Dasam Granth | 712 | 712 | no |
| 1ZF | Guru Granth Sahib Ji | 5 | 4 | no |
| 22S | Guru Granth Sahib Ji | 56 | 55 | no |
| 25E | Sri Dasam Granth | 375 | 375 | no |
| 25X | Sri Dasam Granth | 1152 | 1151 | no |
| 2AF | Sri Dasam Granth | 1027 | 1026 | no |
| 2EA | Sri Dasam Granth | 818 | 817 | no |
| 2FD | Guru Granth Sahib Ji | 1311 | 1310 | no |
| 2HT | Guru Granth Sahib Ji | 1134 | 1133 | no |
| 2KU | Guru Granth Sahib Ji | 299 | 298 | no |
| 2N4 | Guru Granth Sahib Ji | 70 | 69 | no |
| 2NB | Sri Dasam Granth | 732 | 729 | no |
| 2NQ | Sri Dasam Granth | 1214 | 1213 | no |
| 2QR | Guru Granth Sahib Ji | 399 | 398 | no |
| 2RZ | Guru Granth Sahib Ji | 117 | 116 | no |
| 2TV | Sri Dasam Granth | 519 | 518 | no |
| 2TZ | Guru Granth Sahib Ji | 108 | 107 | no |
| 2VK | Guru Granth Sahib Ji | 4 | 3 | no |
| 2Z1 | Guru Granth Sahib Ji | 891 | 890 | no |
| 32L | Guru Granth Sahib Ji | 29 | 28 | no |
| 33E | Guru Granth Sahib Ji | 834 | 833 | no |
| 34P | Guru Granth Sahib Ji | 603 | 602 | no |
| 37P | Sri Dasam Granth | 806 | 805 | no |
| 38Y | Sri Dasam Granth | 616 | 615 | no |
| 3H4 | Sri Dasam Granth | 1268 | 1267 | no |
| 3KX | Sri Dasam Granth | 267 | 266 | no |
| 3L7 | Sri Dasam Granth | 618 | 617 | no |
| 3LL | Guru Granth Sahib Ji | 207 | 206 | no |
| 3N2 | Guru Granth Sahib Ji | 902 | 901 | no |
| 3P6 | Guru Granth Sahib Ji | 972 | 971 | no |
| 3RF | Sri Dasam Granth | 1390 | 1390 | no |
| 3W7 | Guru Granth Sahib Ji | 1084 | 1083 | no |
| 3Z9 | Guru Granth Sahib Ji | 419 | 418 | no |
| 40P | Guru Granth Sahib Ji | 738 | 737 | no |
| 436 | Guru Granth Sahib Ji | 1077 | 1076 | no |
| 44U | Sri Dasam Granth | 1154 | 1153 | no |
| 49Y | Sri Dasam Granth | 574 | 573 | no |
| 4AU | Sri Dasam Granth | 903 | 902 | no |
| 4CR | Guru Granth Sahib Ji | 59 | 58 | no |
| 4FH | Guru Granth Sahib Ji | 47 | 46 | no |
| 4FP | Sri Dasam Granth | 1203 | 1202 | no |
| 4KQ | Sri Dasam Granth | 1053 | 1052 | no |
| 4PB | Guru Granth Sahib Ji | 240 | 239 | no |
| 4PV | Guru Granth Sahib Ji | 848 | 847 | no |
| 4QV | Guru Granth Sahib Ji | 811 | 810 | no |
| 4RN | Sri Dasam Granth | 412 | 411 | no |
| 4S8 | Sri Dasam Granth | 353 | 352 | no |
| 4SJ | Guru Granth Sahib Ji | 123 | 122 | no |
| 4ST | Sri Dasam Granth | 435 | 434 | no |
| 4T5 | Sri Dasam Granth | 1232 | 1231 | no |
| 4TJ | Sri Dasam Granth | 738 | 738 | no |
| 4TY | Guru Granth Sahib Ji | 1028 | 1027 | no |
| 4U1 | Guru Granth Sahib Ji | 22 | 21 | no |
| 4UA | Sri Dasam Granth | 378 | 377 | no |
| 4V4 | Guru Granth Sahib Ji | 856 | 855 | no |
| 4VR | Guru Granth Sahib Ji | 1200 | 1199 | no |
| 4W2 | Sri Dasam Granth | 972 | 971 | no |
| 4Y0 | Guru Granth Sahib Ji | 313 | 312 | no |
| 4ZN | Sri Dasam Granth | 518 | 517 | no |
| 501 | Sri Dasam Granth | 193 | 192 | no |
| 58Y | Guru Granth Sahib Ji | 981 | 980 | no |
| 5CA | Guru Granth Sahib Ji | 1383 | 1382 | no |
| 5F1 | Guru Granth Sahib Ji | 988 | 987 | no |
| 5F5 | Sri Dasam Granth | 414 | 413 | no |
| 5HF | Sri Dasam Granth | 326 | 325 | no |
| 5M1 | Sri Dasam Granth | 758 | 757 | no |
| 5MS | Sri Dasam Granth | 248 | 247 | no |
| 5N2 | Sri Dasam Granth | 1061 | 1060 | no |
| 5Q5 | Guru Granth Sahib Ji | 613 | 612 | no |
| 5QE | Guru Granth Sahib Ji | 1022 | 1021 | no |
| 5SY | Sri Dasam Granth | 866 | 865 | no |
| 5TD | Sri Dasam Granth | 1337 | 1336 | no |
| 5VB | Guru Granth Sahib Ji | 349 | 348 | no |
| 5VM | Sri Dasam Granth | 204 | 204 | no |
| 5XB | Guru Granth Sahib Ji | 974 | 973 | no |
| 62P | Sri Dasam Granth | 1291 | 1290 | no |
| 63C | Guru Granth Sahib Ji | 26 | 25 | no |
| 63E | Guru Granth Sahib Ji | 588 | 587 | no |
| 67F | Guru Granth Sahib Ji | 578 | 577 | no |
| 692 | Sri Dasam Granth | 1052 | 1051 | no |
| 6CK | Guru Granth Sahib Ji | 445 | 444 | no |
| 6GB | Guru Granth Sahib Ji | 1377 | 1376 | no |
| 6GE | Guru Granth Sahib Ji | 674 | 673 | no |
| 6J9 | Sri Dasam Granth | 1353 | 1352 | no |
| 6JD | Sri Dasam Granth | 1035 | 1034 | no |
| 6JP | Guru Granth Sahib Ji | 21 | 20 | no |
| 6T8 | Sri Dasam Granth | 848 | 847 | no |
| 6VR | Guru Granth Sahib Ji | 275 | 274 | no |
| 6X5 | Guru Granth Sahib Ji | 1417 | 1413 | no |
| 6YZ | Guru Granth Sahib Ji | 307 | 306 | no |
| 70J | Sri Dasam Granth | 503 | 502 | no |
| 71D | Sri Dasam Granth | 840 | 839 | no |
| 71R | Sri Dasam Granth | 1382 | 1382 | no |
| 74R | Sri Dasam Granth | 202 | 201 | no |
| 74Y | Guru Granth Sahib Ji | 337 | 336 | no |
| 76M | Sri Dasam Granth | 923 | 922 | no |
| 78K | Sri Dasam Granth | 110 | 109 | no |
| 7CT | Sri Dasam Granth | 897 | 896 | no |
| 7ED | Sri Dasam Granth | 937 | 936 | no |
| 7F8 | Sri Dasam Granth | 125 | 124 | no |
| 7K4 | Sri Dasam Granth | 345 | 344 | no |
| 7MZ | Guru Granth Sahib Ji | 1036 | 1035 | no |
| 7N9 | Sri Dasam Granth | 47 | 46 | no |
| 7PC | Guru Granth Sahib Ji | 959 | 958 | no |
| 7RK | Sri Dasam Granth | 385 | 384 | no |
| 7VU | Sri Dasam Granth | 1095 | 1094 | no |
| 7VV | Guru Granth Sahib Ji | 139 | 138 | no |
| 7WQ | Guru Granth Sahib Ji | 776 | 775 | no |
| 7WT | Guru Granth Sahib Ji | 1151 | 1150 | no |
| 7Y4 | Sri Dasam Granth | 881 | 880 | no |
| 823 | Guru Granth Sahib Ji | 11 | 10 | no |
| 849 | Sri Dasam Granth | 1099 | 1098 | no |
| 84E | Sri Dasam Granth | 989 | 988 | no |
| 853 | Guru Granth Sahib Ji | 1332 | 1331 | no |
| 863 | Guru Granth Sahib Ji | 1062 | 1061 | no |
| 868 | Sri Dasam Granth | 576 | 575 | no |
| 87E | Sri Dasam Granth | 722 | 722 | no |
| 87V | Guru Granth Sahib Ji | 373 | 372 | no |
| 897 | Guru Granth Sahib Ji | 694 | 693 | no |
| 89T | Sri Dasam Granth | 1410 | 1410 | no |
| 8A5 | Guru Granth Sahib Ji | 505 | 504 | no |
| 8F4 | Sri Dasam Granth | 1070 | 1069 | no |
| 8FU | Guru Granth Sahib Ji | 629 | 628 | no |
| 8JQ | Sri Dasam Granth | 583 | 582 | no |
| 8JT | Sri Dasam Granth | 370 | 369 | no |
| 8KZ | Guru Granth Sahib Ji | 433 | 432 | no |
| 8PB | Sri Dasam Granth | 1043 | 1042 | no |
| 8Q2 | Guru Granth Sahib Ji | 1271 | 1270 | no |
| 8Q3 | Guru Granth Sahib Ji | 1124 | 1123 | no |
| 8QV | Sri Dasam Granth | 812 | 811 | no |
| 8R7 | Sri Dasam Granth | 655 | 654 | no |
| 8RA | Guru Granth Sahib Ji | 686 | 685 | no |
| 8SY | Guru Granth Sahib Ji | 72 | 71 | no |
| 8UX | Guru Granth Sahib Ji | 1208 | 1207 | no |
| 8WL | Guru Granth Sahib Ji | 758 | 757 | no |
| 8X0 | Sri Dasam Granth | 978 | 977 | no |
| 8Y0 | Sri Dasam Granth | 150 | 150 | no |
| 8Y8 | Sri Dasam Granth | 10 | 9 | no |
| 90J | Sri Dasam Granth | 260 | 259 | no |
| 90M | Sri Dasam Granth | 722 | 721 | no |
| 94M | Guru Granth Sahib Ji | 1039 | 1038 | no |
| 97V | Sri Dasam Granth | 162 | 161 | no |
| 97Y | Guru Granth Sahib Ji | 1308 | 1307 | no |
| 983 | Guru Granth Sahib Ji | 80 | 79 | no |
| 9AU | Guru Granth Sahib Ji | 106 | 105 | no |
| 9AY | Guru Granth Sahib Ji | 1395 | 1394 | no |
| 9BG | Guru Granth Sahib Ji | 54 | 53 | no |
| 9EG | Sri Dasam Granth | 663 | 662 | no |
| 9F7 | Guru Granth Sahib Ji | 944 | 943 | no |
| 9GE | Sri Dasam Granth | 1010 | 1009 | no |
| 9GM | Guru Granth Sahib Ji | 765 | 764 | no |
| 9GX | Sri Dasam Granth | 603 | 602 | no |
| 9JP | Sri Dasam Granth | 1272 | 1271 | no |
| 9KX | Guru Granth Sahib Ji | 661 | 660 | no |
| 9L8 | Guru Granth Sahib Ji | 952 | 951 | no |
| 9LJ | Guru Granth Sahib Ji | 1005 | 1004 | no |
| 9MS | Sri Dasam Granth | 458 | 457 | no |
| 9MZ | Sri Dasam Granth | 605 | 604 | no |
| 9QA | Guru Granth Sahib Ji | 960 | 959 | no |
| 9QY | Sri Dasam Granth | 1395 | 1394 | no |
| 9RA | Guru Granth Sahib Ji | 96 | 95 | no |
| 9SS | Sri Dasam Granth | 539 | 538 | no |
| 9TH | Sri Dasam Granth | 1221 | 1220 | no |
| 9TL | Guru Granth Sahib Ji | 556 | 555 | no |
| 9VA | Guru Granth Sahib Ji | 1268 | 1267 | no |
| 9Y1 | Guru Granth Sahib Ji | 887 | 886 | no |
| A0H | Guru Granth Sahib Ji | 283 | 282 | no |
| A16 | Guru Granth Sahib Ji | 475 | 474 | no |
| A46 | Guru Granth Sahib Ji | 1368 | 1367 | no |
| A4P | Sri Dasam Granth | 993 | 992 | no |
| A5J | Guru Granth Sahib Ji | 18 | 17 | no |
| A6V | Sri Dasam Granth | 1264 | 1263 | no |
| A88 | Sri Dasam Granth | 52 | 51 | no |
| AAM | Sri Dasam Granth | 674 | 673 | no |
| ABP | Sri Dasam Granth | 680 | 679 | no |
| ACV | Guru Granth Sahib Ji | 1117 | 1116 | no |
| AFA | Guru Granth Sahib Ji | 637 | 636 | no |
| AGA | Sri Dasam Granth | 1280 | 1279 | no |
| AMW | Guru Granth Sahib Ji | 1120 | 1119 | no |
| AX1 | Sri Dasam Granth | 149 | 148 | no |
| AXC | Sri Dasam Granth | 1276 | 1275 | no |
| B15 | Sri Dasam Granth | 363 | 362 | no |
| B2K | Guru Granth Sahib Ji | 1376 | 1375 | no |
| B3G | Guru Granth Sahib Ji | 216 | 215 | no |
| B4B | Sri Dasam Granth | 399 | 398 | no |
| B6R | Guru Granth Sahib Ji | 725 | 724 | no |
| B9K | Guru Granth Sahib Ji | 159 | 158 | no |
| BBR | Sri Dasam Granth | 497 | 496 | no |
| BCY | Guru Granth Sahib Ji | 1203 | 1202 | no |
| BEJ | Guru Granth Sahib Ji | 1144 | 1143 | no |
| BEY | Sri Dasam Granth | 142 | 141 | no |
| BFF | Guru Granth Sahib Ji | 483 | 482 | no |
| BLC | Sri Dasam Granth | 329 | 329 | no |
| BN0 | Sri Dasam Granth | 7 | 6 | no |
| BPR | Guru Granth Sahib Ji | 816 | 815 | no |
| BQM | Guru Granth Sahib Ji | 345 | 344 | no |
| BS6 | Guru Granth Sahib Ji | 446 | 445 | no |
| BTB | Guru Granth Sahib Ji | 654 | 653 | no |
| BTE | Sri Dasam Granth | 1428 | 1427 | no |
| BU3 | Guru Granth Sahib Ji | 753 | 752 | no |
| BWA | Sri Dasam Granth | 779 | 778 | no |
| BWM | Guru Granth Sahib Ji | 412 | 411 | no |
| BWT | Guru Granth Sahib Ji | 927 | 926 | no |
| BY9 | Guru Granth Sahib Ji | 780 | 779 | no |
| BZ4 | Sri Dasam Granth | 1185 | 1184 | no |
| C04 | Guru Granth Sahib Ji | 1011 | 1010 | no |
| C17 | Guru Granth Sahib Ji | 428 | 427 | no |
| C1J | Sri Dasam Granth | 561 | 560 | no |
| C1R | Sri Dasam Granth | 1361 | 1361 | no |
| C3B | Guru Granth Sahib Ji | 736 | 735 | no |
| C3U | Guru Granth Sahib Ji | 1182 | 1181 | no |
| C61 | Sri Dasam Granth | 1286 | 1285 | no |
| C7D | Sri Dasam Granth | 139 | 138 | no |
| C8S | Sri Dasam Granth | 1113 | 1112 | no |
| C8W | Sri Dasam Granth | 302 | 301 | no |
| CA1 | Guru Granth Sahib Ji | 1148 | 1147 | no |
| CA3 | Sri Dasam Granth | 197 | 196 | no |
| CA9 | Sri Dasam Granth | 1260 | 1259 | no |
| CAN | Sri Dasam Granth | 547 | 546 | no |
| CB5 | Sri Dasam Granth | 342 | 341 | no |
| CDN | Sri Dasam Granth | 277 | 276 | no |
| CF0 | Guru Granth Sahib Ji | 119 | 118 | no |
| CG2 | Sri Dasam Granth | 13 | 12 | no |
| CLL | Guru Granth Sahib Ji | 1351 | 1350 | no |
| CPZ | Guru Granth Sahib Ji | 966 | 965 | no |
| CSP | Guru Granth Sahib Ji | 1348 | 1347 | no |
| CSU | Sri Dasam Granth | 83 | 82 | no |
| CV5 | Guru Granth Sahib Ji | 799 | 798 | no |
| CWG | Guru Granth Sahib Ji | 618 | 617 | no |
| CWV | Guru Granth Sahib Ji | 176 | 175 | no |
| D1Y | Guru Granth Sahib Ji | 565 | 564 | no |
| D3J | Guru Granth Sahib Ji | 706 | 705 | no |
| D48 | Sri Dasam Granth | 1138 | 1137 | no |
| D59 | Sri Dasam Granth | 1077 | 1076 | no |
| D5E | Guru Granth Sahib Ji | 1049 | 1048 | no |
| D5H | Sri Dasam Granth | 751 | 750 | no |
| D7J | Sri Dasam Granth | 72 | 71 | no |
| D8B | Sri Dasam Granth | 486 | 485 | no |
| D9A | Sri Dasam Granth | 919 | 918 | no |
| D9S | Guru Granth Sahib Ji | 357 | 356 | no |
| DDD | Guru Granth Sahib Ji | 950 | 949 | no |
| DE1 | Sri Dasam Granth | 800 | 799 | no |
| DGD | Sri Dasam Granth | 1173 | 1172 | no |
| DH7 | Sri Dasam Granth | 245 | 244 | no |
| DL4 | Sri Dasam Granth | 987 | 986 | no |
| DLU | Sri Dasam Granth | 107 | 106 | no |
| DLY | Guru Granth Sahib Ji | 555 | 554 | no |
| DRE | Sri Dasam Granth | 749 | 748 | no |
| DTA | Sri Dasam Granth | 834 | 833 | no |
| DVZ | Sri Dasam Granth | 914 | 913 | no |
| DYX | Sri Dasam Granth | 1226 | 1226 | no |
| E10 | Sri Dasam Granth | 750 | 749 | no |
| E1T | Guru Granth Sahib Ji | 1115 | 1114 | no |
| E40 | Sri Dasam Granth | 1233 | 1233 | no |
| E8N | Sri Dasam Granth | 40 | 39 | no |
| EBU | Sri Dasam Granth | 1262 | 1261 | no |
| ED8 | Guru Granth Sahib Ji | 995 | 994 | no |
| EG0 | Guru Granth Sahib Ji | 7 | 6 | no |
| EJE | Guru Granth Sahib Ji | 365 | 364 | no |
| ELP | Sri Dasam Granth | 186 | 185 | no |
| EPR | Guru Granth Sahib Ji | 761 | 760 | no |
| ERW | Guru Granth Sahib Ji | 183 | 182 | no |
| ET9 | Guru Granth Sahib Ji | 868 | 867 | no |
| ETK | Guru Granth Sahib Ji | 539 | 538 | no |
| EU7 | Guru Granth Sahib Ji | 666 | 665 | no |
| EVH | Guru Granth Sahib Ji | 317 | 316 | no |
| EW7 | Guru Granth Sahib Ji | 1366 | 1365 | no |
| EX1 | Guru Granth Sahib Ji | 1156 | 1155 | no |
| EXM | Sri Dasam Granth | 1004 | 1003 | no |
| EXT | Guru Granth Sahib Ji | 801 | 800 | no |
| EYW | Guru Granth Sahib Ji | 676 | 675 | no |
| EZA | Sri Dasam Granth | 912 | 911 | no |
| F1V | Guru Granth Sahib Ji | 907 | 906 | no |
| F4W | Guru Granth Sahib Ji | 513 | 512 | no |
| F5P | Guru Granth Sahib Ji | 581 | 580 | no |
| F5U | Sri Dasam Granth | 876 | 875 | no |
| F6Q | Guru Granth Sahib Ji | 610 | 609 | no |
| F87 | Sri Dasam Granth | 766 | 765 | no |
| FAY | Guru Granth Sahib Ji | 553 | 552 | no |
| FBD | Guru Granth Sahib Ji | 813 | 812 | no |
| FD3 | Guru Granth Sahib Ji | 1430 | 1429 | no |
| FE1 | Guru Granth Sahib Ji | 171 | 170 | no |
| FF6 | Sri Dasam Granth | 241 | 241 | no |
| FFA | Guru Granth Sahib Ji | 362 | 361 | no |
| FG2 | Sri Dasam Granth | 513 | 512 | no |
| FG3 | Guru Granth Sahib Ji | 50 | 49 | no |
| FGR | Guru Granth Sahib Ji | 1236 | 1235 | no |
| FHN | Guru Granth Sahib Ji | 246 | 245 | no |
| FL1 | Sri Dasam Granth | 1160 | 1159 | no |
| FLU | Guru Granth Sahib Ji | 293 | 292 | no |
| FMG | Guru Granth Sahib Ji | 437 | 436 | no |
| FMU | Guru Granth Sahib Ji | 1361 | 1361 | no |
| FPJ | Sri Dasam Granth | 956 | 955 | no |
| FQG | Guru Granth Sahib Ji | 499 | 498 | no |
| FQM | Sri Dasam Granth | 262 | 261 | no |
| FS0 | Sri Dasam Granth | 646 | 645 | no |
| FUF | Guru Granth Sahib Ji | 714 | 713 | no |
| FYN | Guru Granth Sahib Ji | 699 | 698 | no |
| FZC | Guru Granth Sahib Ji | 977 | 976 | no |
| FZK | Sri Dasam Granth | 258 | 257 | no |
| G7Y | Sri Dasam Granth | 259 | 258 | no |
| GAU | Sri Dasam Granth | 30 | 29 | no |
| GBU | Guru Granth Sahib Ji | 1140 | 1139 | no |
| GH4 | Sri Dasam Granth | 1042 | 1041 | no |
| GK2 | Sri Dasam Granth | 843 | 842 | no |
| GM8 | Sri Dasam Granth | 764 | 763 | no |
| GQK | Guru Granth Sahib Ji | 609 | 608 | no |
| GT2 | Guru Granth Sahib Ji | 471 | 470 | no |
| GWK | Sri Dasam Granth | 466 | 465 | no |
| GYQ | Guru Granth Sahib Ji | 422 | 421 | no |
| H09 | Guru Granth Sahib Ji | 488 | 487 | no |
| H4V | Sri Dasam Granth | 1216 | 1215 | no |
| H5N | Guru Granth Sahib Ji | 1364 | 1363 | no |
| H8D | Sri Dasam Granth | 61 | 60 | no |
| H92 | Guru Granth Sahib Ji | 1244 | 1243 | no |
| HB4 | Sri Dasam Granth | 143 | 142 | no |
| HE4 | Sri Dasam Granth | 247 | 246 | no |
| HEL | Guru Granth Sahib Ji | 334 | 333 | no |
| HGT | Guru Granth Sahib Ji | 645 | 644 | no |
| HL4 | Guru Granth Sahib Ji | 1063 | 1062 | no |
| HRF | Guru Granth Sahib Ji | 174 | 173 | no |
| HS6 | Sri Dasam Granth | 15 | 14 | no |
| HTB | Guru Granth Sahib Ji | 709 | 708 | no |
| HTF | Guru Granth Sahib Ji | 585 | 584 | no |
| HV2 | Sri Dasam Granth | 1060 | 1059 | no |
| HVV | Sri Dasam Granth | 665 | 664 | no |
| HZY | Sri Dasam Granth | 123 | 122 | no |
| J0F | Sri Dasam Granth | 419 | 418 | no |
| J0Q | Guru Granth Sahib Ji | 777 | 776 | no |
| J0U | Guru Granth Sahib Ji | 732 | 731 | no |
| J0W | Sri Dasam Granth | 237 | 236 | no |
| J54 | Sri Dasam Granth | 105 | 104 | no |
| J60 | Guru Granth Sahib Ji | 670 | 669 | no |
| J6K | Guru Granth Sahib Ji | 739 | 738 | no |
| J8B | Sri Dasam Granth | 182 | 181 | no |
| J8M | Guru Granth Sahib Ji | 133 | 132 | no |
| JA3 | Guru Granth Sahib Ji | 1339 | 1338 | no |
| JAQ | Sri Dasam Granth | 199 | 198 | no |
| JC0 | Guru Granth Sahib Ji | 1382 | 1381 | no |
| JCH | Sri Dasam Granth | 1282 | 1281 | no |
| JCV | Guru Granth Sahib Ji | 724 | 723 | no |
| JD1 | Sri Dasam Granth | 846 | 845 | no |
| JFX | Sri Dasam Granth | 120 | 119 | no |
| JGS | Sri Dasam Granth | 359 | 359 | no |
| JK9 | Guru Granth Sahib Ji | 680 | 679 | no |
| JKM | Guru Granth Sahib Ji | 1337 | 1336 | no |
| JMR | Guru Granth Sahib Ji | 715 | 714 | no |
| JNJ | Sri Dasam Granth | 514 | 513 | no |
| JNV | Guru Granth Sahib Ji | 683 | 682 | no |
| JQX | Sri Dasam Granth | 230 | 229 | no |
| JRH | Guru Granth Sahib Ji | 1109 | 1108 | no |
| JU5 | Sri Dasam Granth | 792 | 791 | no |
| JUM | Sri Dasam Granth | 341 | 340 | no |
| K0H | Sri Dasam Granth | 1044 | 1043 | no |
| K25 | Guru Granth Sahib Ji | 1173 | 1172 | no |
| K30 | Sri Dasam Granth | 651 | 650 | no |
| K35 | Guru Granth Sahib Ji | 251 | 250 | no |
| K4D | Sri Dasam Granth | 656 | 655 | no |
| K5M | Guru Granth Sahib Ji | 270 | 269 | no |
| K64 | Sri Dasam Granth | 981 | 980 | no |
| K6W | Sri Dasam Granth | 4 | 3 | no |
| K9T | Guru Granth Sahib Ji | 788 | 787 | no |
| KDX | Guru Granth Sahib Ji | 621 | 620 | no |
| KHB | Guru Granth Sahib Ji | 403 | 402 | no |
| KHN | Guru Granth Sahib Ji | 659 | 658 | no |
| KQ1 | Sri Dasam Granth | 118 | 117 | no |
| KQP | Guru Granth Sahib Ji | 1211 | 1210 | no |
| KZ3 | Guru Granth Sahib Ji | 199 | 198 | no |
| L2J | Sri Dasam Granth | 313 | 312 | no |
| L36 | Sri Dasam Granth | 1057 | 1056 | no |
| L5G | Sri Dasam Granth | 80 | 79 | no |
| L78 | Sri Dasam Granth | 91 | 90 | no |
| L9B | Guru Granth Sahib Ji | 8 | 7 | no |
| LCC | Guru Granth Sahib Ji | 6 | 5 | no |
| LD0 | Guru Granth Sahib Ji | 390 | 389 | no |
| LDZ | Guru Granth Sahib Ji | 1163 | 1162 | no |
| LEZ | Sri Dasam Granth | 20 | 19 | no |
| LG4 | Guru Granth Sahib Ji | 268 | 267 | no |
| LGC | Guru Granth Sahib Ji | 1261 | 1260 | no |
| LGX | Guru Granth Sahib Ji | 162 | 161 | no |
| LJQ | Sri Dasam Granth | 274 | 273 | no |
| LLM | Guru Granth Sahib Ji | 127 | 126 | no |
| LMP | Guru Granth Sahib Ji | 614 | 613 | no |
| LRW | Guru Granth Sahib Ji | 915 | 914 | no |
| LT3 | Sri Dasam Granth | 530 | 529 | no |
| LTP | Sri Dasam Granth | 895 | 894 | no |
| LWK | Guru Granth Sahib Ji | 1349 | 1348 | no |
| LWT | Guru Granth Sahib Ji | 266 | 265 | no |
| M0E | Guru Granth Sahib Ji | 1095 | 1094 | no |
| M1U | Sri Dasam Granth | 1163 | 1162 | no |
| M2L | Guru Granth Sahib Ji | 1286 | 1285 | no |
| M4Z | Guru Granth Sahib Ji | 1191 | 1190 | no |
| M6C | Sri Dasam Granth | 315 | 314 | no |
| M75 | Guru Granth Sahib Ji | 1406 | 1405 | no |
| M96 | Sri Dasam Granth | 127 | 126 | no |
| MB8 | Guru Granth Sahib Ji | 1304 | 1303 | no |
| MBF | Sri Dasam Granth | 129 | 128 | no |
| MDB | Sri Dasam Granth | 559 | 558 | no |
| MER | Guru Granth Sahib Ji | 497 | 496 | no |
| MFA | Guru Granth Sahib Ji | 772 | 771 | no |
| MFT | Sri Dasam Granth | 968 | 967 | no |
| MH7 | Sri Dasam Granth | 1141 | 1140 | no |
| MKG | Guru Granth Sahib Ji | 769 | 768 | no |
| MLA | Guru Granth Sahib Ji | 1172 | 1171 | no |
| MM6 | Sri Dasam Granth | 1352 | 1351 | no |
| MNQ | Guru Granth Sahib Ji | 851 | 850 | no |
| MPU | Sri Dasam Granth | 1400 | 1400 | no |
| MPV | Guru Granth Sahib Ji | 1189 | 1188 | no |
| MQW | Sri Dasam Granth | 851 | 850 | no |
| MS7 | Guru Granth Sahib Ji | 150 | 149 | no |
| MSB | Sri Dasam Granth | 1144 | 1143 | no |
| MW6 | Guru Granth Sahib Ji | 1355 | 1354 | no |
| MXM | Sri Dasam Granth | 1190 | 1189 | no |
| MY2 | Guru Granth Sahib Ji | 301 | 300 | no |
| MY6 | Sri Dasam Granth | 1193 | 1192 | no |
| N0N | Sri Dasam Granth | 432 | 431 | no |
| N3D | Guru Granth Sahib Ji | 1196 | 1195 | no |
| N45 | Sri Dasam Granth | 551 | 550 | no |
| N4E | Guru Granth Sahib Ji | 1373 | 1372 | no |
| N53 | Sri Dasam Granth | 528 | 527 | no |
| N5V | Guru Granth Sahib Ji | 102 | 101 | no |
| N8T | Sri Dasam Granth | 454 | 453 | no |
| NAB | Guru Granth Sahib Ji | 998 | 997 | no |
| ND9 | Guru Granth Sahib Ji | 1045 | 1044 | no |
| NEQ | Guru Granth Sahib Ji | 397 | 396 | no |
| NER | Sri Dasam Granth | 1330 | 1329 | no |
| NHE | Guru Granth Sahib Ji | 19 | 18 | no |
| NJ7 | Sri Dasam Granth | 579 | 578 | no |
| NLA | Sri Dasam Granth | 310 | 309 | no |
| NLB | Sri Dasam Granth | 1379 | 1378 | no |
| NPD | Guru Granth Sahib Ji | 78 | 77 | no |
| NPW | Sri Dasam Granth | 1102 | 1101 | no |
| NPZ | Sri Dasam Granth | 608 | 607 | no |
| NQS | Guru Granth Sahib Ji | 983 | 982 | no |
| NSJ | Guru Granth Sahib Ji | 1316 | 1315 | no |
| NTZ | Sri Dasam Granth | 703 | 702 | no |
| NZV | Sri Dasam Granth | 787 | 786 | no |
| P03 | Sri Dasam Granth | 221 | 220 | no |
| P07 | Sri Dasam Granth | 355 | 354 | no |
| P43 | Sri Dasam Granth | 1345 | 1344 | no |
| P5B | Guru Granth Sahib Ji | 1013 | 1012 | no |
| PF5 | Sri Dasam Granth | 892 | 891 | no |
| PF8 | Sri Dasam Granth | 553 | 552 | no |
| PHY | Sri Dasam Granth | 14 | 13 | no |
| PPM | Guru Granth Sahib Ji | 568 | 567 | no |
| PQ9 | Sri Dasam Granth | 507 | 506 | no |
| PSB | Guru Granth Sahib Ji | 754 | 753 | no |
| PX6 | Sri Dasam Granth | 96 | 95 | no |
| Q4W | Guru Granth Sahib Ji | 1303 | 1302 | no |
| QAU | Guru Granth Sahib Ji | 1323 | 1322 | no |
| QE2 | Guru Granth Sahib Ji | 1100 | 1099 | no |
| QE8 | Sri Dasam Granth | 630 | 629 | no |
| QJ3 | Sri Dasam Granth | 36 | 35 | no |
| QMD | Guru Granth Sahib Ji | 547 | 546 | no |
| QMK | Guru Granth Sahib Ji | 167 | 166 | no |
| QP4 | Sri Dasam Granth | 133 | 132 | no |
| QXG | Guru Granth Sahib Ji | 561 | 560 | no |
| R1G | Guru Granth Sahib Ji | 330 | 329 | no |
| RDV | Sri Dasam Granth | 659 | 658 | no |
| RN8 | Sri Dasam Granth | 171 | 170 | no |
| RR2 | Guru Granth Sahib Ji | 544 | 543 | no |
| RTS | Sri Dasam Granth | 621 | 620 | no |
| RWU | Sri Dasam Granth | 482 | 481 | no |
| RY0 | Sri Dasam Granth | 526 | 525 | no |
| RY8 | Sri Dasam Granth | 1182 | 1181 | no |
| RZZ | Guru Granth Sahib Ji | 1301 | 1300 | no |
| S7A | Sri Dasam Granth | 1406 | 1406 | no |
| SAA | Guru Granth Sahib Ji | 622 | 621 | no |
| SD3 | Sri Dasam Granth | 720 | 719 | no |
| SDZ | Sri Dasam Granth | 546 | 545 | no |
| SE3 | Sri Dasam Granth | 832 | 831 | no |
| SLH | Guru Granth Sahib Ji | 1235 | 1234 | no |
| SMW | Guru Granth Sahib Ji | 156 | 155 | no |
| SN9 | Sri Dasam Granth | 38 | 37 | no |
| SPX | Guru Granth Sahib Ji | 10 | 9 | no |
| T1A | Guru Granth Sahib Ji | 693 | 692 | no |
| T2M | Sri Dasam Granth | 1115 | 1114 | no |
| T5T | Sri Dasam Granth | 207 | 207 | no |
| T6F | Guru Granth Sahib Ji | 749 | 748 | no |
| T8J | Sri Dasam Granth | 916 | 915 | no |
| T94 | Sri Dasam Granth | 963 | 962 | no |
| TFG | Sri Dasam Granth | 1301 | 1300 | no |
| TFR | Sri Dasam Granth | 900 | 899 | no |
| TJD | Guru Granth Sahib Ji | 946 | 945 | no |
| TJM | Guru Granth Sahib Ji | 407 | 406 | no |
| TKA | Sri Dasam Granth | 30 | 30 | no |
| TKE | Sri Dasam Granth | 166 | 164 | no |
| TNM | Guru Granth Sahib Ji | 930 | 929 | no |
| TNR | Sri Dasam Granth | 67 | 66 | no |
| TR1 | Sri Dasam Granth | 306 | 305 | no |
| TT7 | Guru Granth Sahib Ji | 833 | 832 | no |
| TUY | Guru Granth Sahib Ji | 917 | 917 | no |
| TVQ | Sri Dasam Granth | 1284 | 1283 | no |
| TXY | Sri Dasam Granth | 166 | 166 | no |
| TY0 | Guru Granth Sahib Ji | 860 | 859 | no |
| UAE | Sri Dasam Granth | 1269 | 1268 | no |
| UBD | Sri Dasam Granth | 294 | 293 | no |
| UBH | Guru Granth Sahib Ji | 784 | 783 | no |
| UBU | Sri Dasam Granth | 235 | 234 | no |
| UC7 | Sri Dasam Granth | 375 | 374 | no |
| UDJ | Guru Granth Sahib Ji | 1093 | 1092 | no |
| UDK | Sri Dasam Granth | 1046 | 1045 | no |
| UDV | Guru Granth Sahib Ji | 879 | 878 | no |
| UH4 | Sri Dasam Granth | 415 | 414 | no |
| ULT | Guru Granth Sahib Ji | 548 | 547 | no |
| USH | Sri Dasam Granth | 304 | 303 | no |
| UTD | Guru Granth Sahib Ji | 827 | 826 | no |
| UTP | Sri Dasam Granth | 639 | 638 | no |
| UVJ | Sri Dasam Granth | 350 | 349 | no |
| UY9 | Guru Granth Sahib Ji | 62 | 61 | no |
| UZE | Guru Granth Sahib Ji | 852 | 851 | no |
| VC5 | Sri Dasam Granth | 829 | 828 | no |
| VD2 | Guru Granth Sahib Ji | 290 | 289 | no |
| VGL | Guru Granth Sahib Ji | 909 | 908 | no |
| VJA | Sri Dasam Granth | 5 | 4 | no |
| VRJ | Guru Granth Sahib Ji | 231 | 230 | no |
| VTA | Sri Dasam Granth | 189 | 188 | no |
| VVQ | Sri Dasam Granth | 775 | 773 | no |
| VWS | Guru Granth Sahib Ji | 326 | 325 | no |
| VYL | Sri Dasam Granth | 226 | 225 | no |
| W2V | Guru Granth Sahib Ji | 441 | 440 | no |
| W51 | Guru Granth Sahib Ji | 803 | 802 | no |
| W74 | Guru Granth Sahib Ji | 1031 | 1030 | no |
| W8L | Sri Dasam Granth | 1357 | 1356 | no |
| WA8 | Sri Dasam Granth | 491 | 490 | no |
| WEB | Sri Dasam Granth | 807 | 807 | no |
| WF8 | Guru Granth Sahib Ji | 467 | 466 | no |
| WG1 | Sri Dasam Granth | 885 | 884 | no |
| WJ0 | Guru Granth Sahib Ji | 85 | 84 | no |
| WNB | Sri Dasam Granth | 625 | 624 | no |
| WP1 | Sri Dasam Granth | 234 | 233 | no |
| WPQ | Sri Dasam Granth | 1212 | 1211 | no |
| WQ5 | Sri Dasam Granth | 1300 | 1299 | no |
| WSH | Guru Granth Sahib Ji | 593 | 592 | no |
| WST | Sri Dasam Granth | 70 | 69 | no |
| WVX | Sri Dasam Granth | 563 | 562 | no |
| WXE | Guru Granth Sahib Ji | 1081 | 1080 | no |
| WZ0 | Guru Granth Sahib Ji | 1091 | 1090 | no |
| WZZ | Guru Granth Sahib Ji | 604 | 603 | no |
| X1T | Guru Granth Sahib Ji | 258 | 257 | no |
| X3K | Sri Dasam Granth | 1416 | 1416 | no |
| X7J | Sri Dasam Granth | 701 | 700 | no |
| XAA | Guru Granth Sahib Ji | 1340 | 1339 | no |
| XJK | Sri Dasam Granth | 307 | 306 | no |
| XKZ | Sri Dasam Granth | 538 | 537 | no |
| XP1 | Guru Granth Sahib Ji | 1279 | 1278 | no |
| XQ5 | Sri Dasam Granth | 93 | 92 | no |
| XU4 | Guru Granth Sahib Ji | 1277 | 1276 | no |
| XX4 | Guru Granth Sahib Ji | 1073 | 1072 | no |
| XZH | Sri Dasam Granth | 522 | 521 | no |
| Y0B | Sri Dasam Granth | 861 | 860 | no |
| Y1R | Sri Dasam Granth | 640 | 640 | no |
| Y2Z | Sri Dasam Granth | 906 | 905 | no |
| Y56 | Sri Dasam Granth | 113 | 112 | no |
| Y9U | Sri Dasam Granth | 672 | 671 | no |
| YBW | Guru Granth Sahib Ji | 572 | 571 | no |
| YH9 | Sri Dasam Granth | 1206 | 1205 | no |
| YLF | Guru Granth Sahib Ji | 1006 | 1005 | no |
| YRV | Guru Granth Sahib Ji | 969 | 968 | no |
| YS6 | Sri Dasam Granth | 104 | 103 | no |
| YVF | Sri Dasam Granth | 801 | 800 | no |
| Z28 | Sri Dasam Granth | 252 | 251 | no |
| Z60 | Sri Dasam Granth | 1036 | 1035 | no |
| Z64 | Guru Granth Sahib Ji | 77 | 76 | no |
| Z71 | Sri Dasam Granth | 440 | 439 | no |
| Z79 | Sri Dasam Granth | 706 | 705 | no |
| ZAS | Guru Granth Sahib Ji | 1015 | 1014 | no |
| ZE9 | Guru Granth Sahib Ji | 1160 | 1159 | no |
| ZED | Guru Granth Sahib Ji | 409 | 408 | no |
| ZMD | Sri Dasam Granth | 135 | 134 | no |
| ZN5 | Sri Dasam Granth | 407 | 406 | no |
| ZVM | Sri Dasam Granth | 1148 | 1147 | no |
