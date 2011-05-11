var HTML5 = (function() {

    if (!Array.prototype.last) {
        Object.defineProperty(Array.prototype, 'last', {
            value: function() { return this[this.length - 1]; }
        });
    }

    var CONTENT_MODEL_FLAGS = [
        'PCDATA',
        'RCDATA',
        'CDATA',
        'PLAINTEXT'
    ];

    var Marker = {type: 'Marker', data: 'this is a marker token'};

    var EOF = "\0";
    var EOF_TOK = {type: 'EOF', data: 'End of File' };

    var SCOPING_ELEMENTS = [
        'applet',
        'button',
        'caption',
        'html',
        'marquee',
        'object',
        'table',
        'td',
        'th'
    ];
    var FORMATTING_ELEMENTS = [
        'a',
        'b',
        'big',
        'em',
        'font',
        'i',
        'nobr',
        's',
        'small',
        'strike',
        'strong',
        'tt',
        'u'
    ];
    var SPECIAL_ELEMENTS = [
        'address',
        'area',
        'base',
        'basefont',
        'bgsound',
        'blockquote',
        'body',
        'br',
        'center',
        'col',
        'colgroup',
        'dd',
        'dir',
        'div',
        'dl',
        'dt',
        'embed',
        'fieldset',
        'form',
        'frame',
        'frameset',
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'head',
        'hr',
        'iframe',
        'image',
        'img',
        'input',
        'isindex',
        'li',
        'link',
        'listing',
        'menu',
        'meta',
        'noembed',
        'noframes',
        'noscript',
        'ol',
        'optgroup',
        'option',
        'p',
        'param',
        'plaintext',
        'pre',
        'script',
        'select',
        'spacer',
        'style',
        'tbody',
        'textarea',
        'tfoot',
        'thead',
        'title',
        'tr',
        'ul',
        'wbr'
    ];
    var SPACE_CHARACTERS_IN = "\t\n\x0B\x0C\x20\u0012\r";
    var SPACE_CHARACTERS = "[\t\n\x0B\x0C\x20\r]";
    var SPACE_CHARACTERS_R = /^[\t\n\x0B\x0C \r]/;

    var TABLE_INSERT_MODE_ELEMENTS = [
        'table',
        'tbody',
        'tfoot',
        'thead',
        'tr'
    ];

    var ASCII_LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
    var ASCII_UPPERCASE = ASCII_LOWERCASE.toUpperCase();
    var ASCII_LETTERS = "[a-zA-Z]";
    var ASCII_LETTERS_R = /^[a-zA-Z]/;
    var DIGITS = '0123456789';
    var DIGITS_R = new RegExp('^[0123456789]');
    var HEX_DIGITS = DIGITS + 'abcdefABCDEF';
    var HEX_DIGITS_R = new RegExp('^[' + DIGITS + 'abcdefABCDEF' +']' );

    // Heading elements need to be ordered 
    var HEADING_ELEMENTS = [
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6'
    ];

    var VOID_ELEMENTS = [
        'base',
        'link',
        'meta',
        'hr',
        'br',
        'img',
        'embed',
        'param',
        'area',
        'col',
        'input'
    ];

    var CDATA_ELEMENTS = [
        'title',
        'textarea'
    ];

    var RCDATA_ELEMENTS = [
        'style',
        'script',
        'xmp',
        'iframe',
        'noembed',
        'noframes',
        'noscript'
    ];

    var BOOLEAN_ATTRIBUTES = {
        '_global': ['irrelevant'],
        // Fixme?
        'style': ['scoped'],
        'img': ['ismap'],
        'audio': ['autoplay', 'controls'],
        'video': ['autoplay', 'controls'],
        'script': ['defer', 'async'],
        'details': ['open'],
        'datagrid': ['multiple', 'disabled'],
        'command': ['hidden', 'disabled', 'checked', 'default'],
        'menu': ['autosubmit'],
        'fieldset': ['disabled', 'readonly'],
        'option': ['disabled', 'readonly', 'selected'],
        'optgroup': ['disabled', 'readonly'],
        'button': ['disabled', 'autofocus'],
        'input': ['disabled', 'readonly', 'required', 'autofocus', 'checked', 'ismap'],
        'select': ['disabled', 'readonly', 'autofocus', 'multiple'],
        'output': ['disabled', 'readonly']
    }

    // entitiesWindows1252 has to be _ordered_ and needs to have an index.
    var ENTITIES_WINDOWS1252 = [
        8364, // 0x80  0x20AC  EURO SIGN
        65533, // 0x81          UNDEFINED
        8218, // 0x82  0x201A  SINGLE LOW-9 QUOTATION MARK
        402, // 0x83  0x0192  LATIN SMALL LETTER F WITH HOOK
        8222, // 0x84  0x201E  DOUBLE LOW-9 QUOTATION MARK
        8230, // 0x85  0x2026  HORIZONTAL ELLIPSIS
        8224, // 0x86  0x2020  DAGGER
        8225, // 0x87  0x2021  DOUBLE DAGGER
        710, // 0x88  0x02C6  MODIFIER LETTER CIRCUMFLEX ACCENT
        8240, // 0x89  0x2030  PER MILLE SIGN
        352, // 0x8A  0x0160  LATIN CAPITAL LETTER S WITH CARON
        8249, // 0x8B  0x2039  SINGLE LEFT-POINTING ANGLE QUOTATION MARK
        338, // 0x8C  0x0152  LATIN CAPITAL LIGATURE OE
        65533, // 0x8D          UNDEFINED
        381, // 0x8E  0x017D  LATIN CAPITAL LETTER Z WITH CARON
        65533, // 0x8F          UNDEFINED
        65533, // 0x90          UNDEFINED
        8216, // 0x91  0x2018  LEFT SINGLE QUOTATION MARK
        8217, // 0x92  0x2019  RIGHT SINGLE QUOTATION MARK
        8220, // 0x93  0x201C  LEFT DOUBLE QUOTATION MARK
        8221, // 0x94  0x201D  RIGHT DOUBLE QUOTATION MARK
        8226, // 0x95  0x2022  BULLET
        8211, // 0x96  0x2013  EN DASH
        8212, // 0x97  0x2014  EM DASH
        732, // 0x98  0x02DC  SMALL TILDE
        8482, // 0x99  0x2122  TRADE MARK SIGN
        353, // 0x9A  0x0161  LATIN SMALL LETTER S WITH CARON
        8250, // 0x9B  0x203A  SINGLE RIGHT-POINTING ANGLE QUOTATION MARK
        339, // 0x9C  0x0153  LATIN SMALL LIGATURE OE
        65533, // 0x9D          UNDEFINED
        382, // 0x9E  0x017E  LATIN SMALL LETTER Z WITH CARON
        376    // 0x9F  0x0178  LATIN CAPITAL LETTER Y WITH DIAERESIS
    ];

    var ENTITIES = {
        'AElig': "\u00C6",
        'AElig;': "\u00C6",
        'AMP': '&',
        'AMP;': '&',
        'Aacute': "\u00C1",
        'Aacute;': "\u00C1",
        'Acirc': "\u00C2",
        'Acirc;': "\u00C2",
        'Agrave': "\u00C0",
        'Agrave;': "\u00C0",
        'Alpha;': "\u0391",
        'Aring': "\u00C5",
        'Aring;': "\u00C5",
        'Atilde': "\u00C3",
        'Atilde;': "\u00C3",
        'Auml': "\u00C4",
        'Auml;': "\u00C4",
        'Beta;': "\u0392",
        'COPY': "\u00A9",
        'COPY;': "\u00A9",
        'Ccedil': "\u00C7",
        'Ccedil;': "\u00C7",
        'Chi;': "\u03A7",
        'Dagger;': "\u2021",
        'Delta;': "\u0394",
        'ETH': "\u00D0",
        'ETH;': "\u00D0",
        'Eacute': "\u00C9",
        'Eacute;': "\u00C9",
        'Ecirc': "\u00CA",
        'Ecirc;': "\u00CA",
        'Egrave': "\u00C8",
        'Egrave;': "\u00C8",
        'Epsilon;': "\u0395",
        'Eta;': "\u0397",
        'Euml': "\u00CB",
        'Euml;': "\u00CB",
        'GT': '>',
        'GT;': '>',
        'Gamma;': "\u0393",
        'Iacute': "\u00CD",
        'Iacute;': "\u00CD",
        'Icirc': "\u00CE",
        'Icirc;': "\u00CE",
        'Igrave': "\u00CC",
        'Igrave;': "\u00CC",
        'Iota;': "\u0399",
        'Iuml': "\u00CF",
        'Iuml;': "\u00CF",
        'Kappa;': "\u039A",
        'LT': '<',
        'LT;': '<',
        'Lambda;': "\u039B",
        'Mu;': "\u039C",
        'Ntilde': "\u00D1",
        'Ntilde;': "\u00D1",
        'Nu;': "\u039D",
        'OElig;': "\u0152",
        'Oacute': "\u00D3",
        'Oacute;': "\u00D3",
        'Ocirc': "\u00D4",
        'Ocirc;': "\u00D4",
        'Ograve': "\u00D2",
        'Ograve;': "\u00D2",
        'Omega;': "\u03A9",
        'Omicron;': "\u039F",
        'Oslash': "\u00D8",
        'Oslash;': "\u00D8",
        'Otilde': "\u00D5",
        'Otilde;': "\u00D5",
        'Ouml': "\u00D6",
        'Ouml;': "\u00D6",
        'Phi;': "\u03A6",
        'Pi;': "\u03A0",
        'Prime;': "\u2033",
        'Psi;': "\u03A8",
        'QUOT': '"',
        'QUOT;': '"',
        'REG': "\u00AE",
        'REG;': "\u00AE",
        'Rho;': "\u03A1",
        'Scaron;': "\u0160",
        'Sigma;': "\u03A3",
        'THORN': "\u00DE",
        'THORN;': "\u00DE",
        'TRADE;': "\u2122",
        'Tau;': "\u03A4",
        'Theta;': "\u0398",
        'Uacute': "\u00DA",
        'Ucirc': "\u00DB",
        'Ucirc;': "\u00DB",
        'Ugrave': "\u00D9",
        'Ugrave;': "\u00D9",
        'Upsilon;': "\u03A5",
        'Uuml': "\u00DC",
        'Uuml;': "\u00DC",
        'Xi;': "\u039E",
        'Yacute': "\u00DD",
        'Yacute;': "\u00DD",
        'Yuml;': "\u0178",
        'Zeta;': "\u0396",
        'aacute': "\u00E1",
        'aacute;': "\u00E1",
        'acirc': "\u00E2",
        'acirc;': "\u00E2",
        'acute': "\u00B4",
        'acute;': "\u00B4",
        'aelig': "\u00E6",
        'aelig;': "\u00E6",
        'agrave': "\u00E0",
        'agrave;': "\u00E0",
        'alefsym;': "\u2135",
        'alpha;': "\u03B1",
        'amp': '&',
        'amp;': '&',
        'and;': "\u2227",
        'ang;': "\u2220",
        'apos;': "'",
        'aring': "\u00E5",
        'aring;': "\u00E5",
        'asymp;': "\u2248",
        'atilde': "\u00E3",
        'atilde;': "\u00E3",
        'auml': "\u00E4",
        'auml;': "\u00E4",
        'bdquo;': "\u201E",
        'beta;': "\u03B2",
        'brvbar': "\u00A6",
        'brvbar;': "\u00A6",
        'bull;': "\u2022",
        'cap;': "\u2229",
        'ccedil': "\u00E7",
        'ccedil;': "\u00E7",
        'cedil': "\u00B8",
        'cent': "\u00A2",
        'cent;': "\u00A2",
        'chi;': "\u03C7",
        'circ;': "\u02C6",
        'clubs;': "\u2663",
        'cong;': "\u2245",
        'copy': "\u00A9",
        'copy;': "\u00A9",
        'crarr;': "\u21B5",
        'cup;': "\u222A",
        'curren': "\u00A4",
        'curren;': "\u00A4",
        'dArr;': "\u21D3",
        'dagger;': "\u2020",
        'darr;': "\u2193",
        'deg': "\u00B0",
        'deg;': "\u00B0",
        'delta;': "\u03B4",
        'diams;': "\u2666",
        'divide': "\u00F7",
        'divide;': "\u00F7",
        'eacute': "\u00E9",
        'eacute;': "\u00E9",
        'ecirc': "\u00EA",
        'ecirc;': "\u00EA",
        'egrave': "\u00E8",
        'egrave;': "\u00E8",
        'empty;': "\u2205",
        'emsp;': "\u2003",
        'ensp;': "\u2002",
        'epsilon;': "\u03B5",
        'equiv;': "\u2261",
        'eta;': "\u03B7",
        'eth': "\u00F0",
        'eth;': "\u00F0",
        'euml': "\u00EB",
        'euml;': "\u00EB",
        'euro;': "\u20AC",
        'exist;': "\u2203",
        'fnof;': "\u0192",
        'forall;': "\u2200",
        'frac12': "\u00BD",
        'frac12;': "\u00BD",
        'frac14': "\u00BC",
        'frac14;': "\u00BC",
        'frac34': "\u00BE",
        'frac34;': "\u00BE",
        'frasl;': "\u2044",
        'gamma;': "\u03B3",
        'ge;': "\u2265",
        'gt': '>',
        'gt;': '>',
        'hArr;': "\u21D4",
        'harr;': "\u2194",
        'hearts;': "\u2665",
        'hellip;': "\u2026",
        'iacute': "\u00ED",
        'iacute;': "\u00ED",
        'icirc': "\u00EE",
        'icirc;': "\u00EE",
        'iexcl': "\u00A1",
        'iexcl;': "\u00A1",
        'igrave': "\u00EC",
        'igrave;': "\u00EC",
        'image;': "\u2111",
        'infin;': "\u221E",
        'int;': "\u222B",
        'iota;': "\u03B9",
        'iquest': "\u00BF",
        'iquest;': "\u00BF",
        'isin;': "\u2208",
        'iuml': "\u00EF",
        'iuml;': "\u00EF",
        'kappa;': "\u03BA",
        'lArr;': "\u21D0",
        'lambda;': "\u03BB",
        'lang;': "\u27E8",
        'laquo': "\u00AB",
        'laquo;': "\u00AB",
        'larr;': "\u2190",
        'lceil;': "\u2308",
        'ldquo;': "\u201C",
        'le;': "\u2264",
        'lfloor;': "\u230A",
        'lowast;': "\u2217",
        'loz;': "\u25CA",
        'lrm;': "\u200E",
        'lsaquo;': "\u2039",
        'lsquo;': "\u2018",
        'lt': '<',
        'lt;': '<',
        'macr': "\u00AF",
        'macr;': "\u00AF",
        'mdash;': "\u2014",
        'micro': "\u00B5",
        'micro;': "\u00B5",
        'middot': "\u00B7",
        'middot;': "\u00B7",
        'minus;': "\u2212",
        'mu;': "\u03BC",
        'nabla;': "\u2207",
        'nbsp': "\u00A0",
        'nbsp;': "\u00A0",
        'ndash;': "\u2013",
        'ne;': "\u2260",
        'ni;': "\u220B",
        'not': "\u00AC",
        'not;': "\u00AC",
        'notin;': "\u2209",
        'nsub;': "\u2284",
        'ntilde': "\u00F1",
        'ntilde;': "\u00F1",
        'nu;': "\u03BD",
        'oacute': "\u00F3",
        'oacute;': "\u00F3",
        'ocirc': "\u00F4",
        'ocirc;': "\u00F4",
        'oelig;': "\u0153",
        'ograve': "\u00F2",
        'ograve;': "\u00F2",
        'oline;': "\u203E",
        'omega;': "\u03C9",
        'omicron;': "\u03BF",
        'oplus;': "\u2295",
        'or;': "\u2228",
        'ordf': "\u00AA",
        'ordf;': "\u00AA",
        'ordm': "\u00BA",
        'ordm;': "\u00BA",
        'oslash': "\u00F8",
        'oslash;': "\u00F8",
        'otilde': "\u00F5",
        'otilde;': "\u00F5",
        'otimes;': "\u2297",
        'ouml': "\u00F6",
        'ouml;': "\u00F6",
        'para': "\u00B6",
        'para;': "\u00B6",
        'part;': "\u2202",
        'permil;': "\u2030",
        'perp;': "\u22A5",
        'phi;': "\u03C6",
        'pi;': "\u03C0",
        'piv;': "\u03D6",
        'plusmn': "\u00B1",
        'plusmn;': "\u00B1",
        'pound': "\u00A3",
        'pound;': "\u00A3",
        'prime;': "\u2032",
        'prod;': "\u220F",
        'prop;': "\u221D",
        'psi;': "\u03C8",
        'quot': '"',
        'quot;': '"',
        'rArr;': "\u21D2",
        'radic;': "\u221A",
        'rang;': "\u27E9",
        'raquo': "\u00BB",
        'raquo;': "\u00BB",
        'rarr;': "\u2192",
        'rceil;': "\u2309",
        'rdquo;': "\u201D",
        'real;': "\u211C",
        'reg': "\u00AE",
        'reg;': "\u00AE",
        'rfloor;': "\u230B",
        'rho;': "\u03C1",
        'rlm;': "\u200F",
        'rsaquo;': "\u203A",
        'rsquo;': "\u2019",
        'sbquo;': "\u201A",
        'scaron;': "\u0161",
        'sdot;': "\u22C5",
        'sect': "\u00A7",
        'sect;': "\u00A7",
        'shy': "\u00AD",
        'shy;': "\u00AD",
        'sigma;': "\u03C3",
        'sigmaf;': "\u03C2",
        'sim;': "\u223C",
        'spades;': "\u2660",
        'sub;': "\u2282",
        'sube;': "\u2286",
        'sum;': "\u2211",
        'sup1': "\u00B9",
        'sup1;': "\u00B9",
        'sup2': "\u00B2",
        'sup2;': "\u00B2",
        'sup3': "\u00B3",
        'sup3;': "\u00B3",
        'sup;': "\u2283",
        'supe;': "\u2287",
        'szlig': "\u00DF",
        'szlig;': "\u00DF",
        'tau;': "\u03C4",
        'there4;': "\u2234",
        'theta;': "\u03B8",
        'thetasym;': "\u03D1",
        'thinsp;': "\u2009",
        'thorn': "\u00FE",
        'thorn;': "\u00FE",
        'tilde;': "\u02DC",
        'times': "\u00D7",
        'times;': "\u00D7",
        'trade;': "\u2122",
        'uArr;': "\u21D1",
        'uacute': "\u00FA",
        'uacute;': "\u00FA",
        'uarr;': "\u2191",
        'ucirc': "\u00FB",
        'ucirc;': "\u00FB",
        'ugrave': "\u00F9",
        'ugrave;': "\u00F9",
        'uml': "\u00A8",
        'uml;': "\u00A8",
        'upsih;': "\u03D2",
        'upsilon;': "\u03C5",
        'uuml': "\u00FC",
        'uuml;': "\u00FC",
        'weierp;': "\u2118",
        'xi;': "\u03BE",
        'yacute': "\u00FD",
        'yacute;': "\u00FD",
        'yen': "\u00A5",
        'yen;': "\u00A5",
        'yuml': "\u00FF",
        'yuml;': "\u00FF",
        'zeta;': "\u03B6",
        'zwj;': "\u200D",
        'zwnj;': "\u200C"
    }

    var ENCODINGS = [
        'ansi_x3.4-1968',
        'iso-ir-6',
        'ansi_x3.4-1986',
        'iso_646.irv:1991',
        'ascii',
        'iso646-us',
        'us-ascii',
        'us',
        'ibm367',
        'cp367',
        'csascii',
        'ks_c_5601-1987',
        'korean',
        'iso-2022-kr',
        'csiso2022kr',
        'euc-kr',
        'iso-2022-jp',
        'csiso2022jp',
        'iso-2022-jp-2',
        '',
        'iso-ir-58',
        'chinese',
        'csiso58gb231280',
        'iso_8859-1:1987',
        'iso-ir-100',
        'iso_8859-1',
        'iso-8859-1',
        'latin1',
        'l1',
        'ibm819',
        'cp819',
        'csisolatin1',
        'iso_8859-2:1987',
        'iso-ir-101',
        'iso_8859-2',
        'iso-8859-2',
        'latin2',
        'l2',
        'csisolatin2',
        'iso_8859-3:1988',
        'iso-ir-109',
        'iso_8859-3',
        'iso-8859-3',
        'latin3',
        'l3',
        'csisolatin3',
        'iso_8859-4:1988',
        'iso-ir-110',
        'iso_8859-4',
        'iso-8859-4',
        'latin4',
        'l4',
        'csisolatin4',
        'iso_8859-6:1987',
        'iso-ir-127',
        'iso_8859-6',
        'iso-8859-6',
        'ecma-114',
        'asmo-708',
        'arabic',
        'csisolatinarabic',
        'iso_8859-7:1987',
        'iso-ir-126',
        'iso_8859-7',
        'iso-8859-7',
        'elot_928',
        'ecma-118',
        'greek',
        'greek8',
        'csisolatingreek',
        'iso_8859-8:1988',
        'iso-ir-138',
        'iso_8859-8',
        'iso-8859-8',
        'hebrew',
        'csisolatinhebrew',
        'iso_8859-5:1988',
        'iso-ir-144',
        'iso_8859-5',
        'iso-8859-5',
        'cyrillic',
        'csisolatincyrillic',
        'iso_8859-9:1989',
        'iso-ir-148',
        'iso_8859-9',
        'iso-8859-9',
        'latin5',
        'l5',
        'csisolatin5',
        'iso-8859-10',
        'iso-ir-157',
        'l6',
        'iso_8859-10:1992',
        'csisolatin6',
        'latin6',
        'hp-roman8',
        'roman8',
        'r8',
        'ibm037',
        'cp037',
        'csibm037',
        'ibm424',
        'cp424',
        'csibm424',
        'ibm437',
        'cp437',
        '437',
        'cspc8codepage437',
        'ibm500',
        'cp500',
        'csibm500',
        'ibm775',
        'cp775',
        'cspc775baltic',
        'ibm850',
        'cp850',
        '850',
        'cspc850multilingual',
        'ibm852',
        'cp852',
        '852',
        'cspcp852',
        'ibm855',
        'cp855',
        '855',
        'csibm855',
        'ibm857',
        'cp857',
        '857',
        'csibm857',
        'ibm860',
        'cp860',
        '860',
        'csibm860',
        'ibm861',
        'cp861',
        '861',
        'cp-is',
        'csibm861',
        'ibm862',
        'cp862',
        '862',
        'cspc862latinhebrew',
        'ibm863',
        'cp863',
        '863',
        'csibm863',
        'ibm864',
        'cp864',
        'csibm864',
        'ibm865',
        'cp865',
        '865',
        'csibm865',
        'ibm866',
        'cp866',
        '866',
        'csibm866',
        'ibm869',
        'cp869',
        '869',
        'cp-gr',
        'csibm869',
        'ibm1026',
        'cp1026',
        'csibm1026',
        'koi8-r',
        'cskoi8r',
        'koi8-u',
        'big5-hkscs',
        'ptcp154',
        'csptcp154',
        'pt154',
        'cp154',
        'utf-7',
        'utf-16be',
        'utf-16le',
        'utf-16',
        'utf-8',
        'iso-8859-13',
        'iso-8859-14',
        'iso-ir-199',
        'iso_8859-14:1998',
        'iso_8859-14',
        'latin8',
        'iso-celtic',
        'l8',
        'iso-8859-15',
        'iso_8859-15',
        'iso-8859-16',
        'iso-ir-226',
        'iso_8859-16:2001',
        'iso_8859-16',
        'latin10',
        'l10',
        'gbk',
        'cp936',
        'ms936',
        'gb18030',
        'shift_jis',
        'ms_kanji',
        'csshiftjis',
        'euc-jp',
        'gb2312',
        'big5',
        'csbig5',
        'windows-1250',
        'windows-1251',
        'windows-1252',
        'windows-1253',
        'windows-1254',
        'windows-1255',
        'windows-1256',
        'windows-1257',
        'windows-1258',
        'tis-620',
        'hz-gb-2312'
    ];

    var E = {
        "null-character":
        "Null character in input stream, replaced with U+FFFD.",
        "incorrectly-placed-solidus":
        "Solidus (/) incorrectly placed in tag.",
        "incorrect-cr-newline-entity":
        "Incorrect CR newline entity, replaced with LF.",
        "illegal-windows-1252-entity":
        "Entity used with illegal number (windows-1252 reference).",
        "cant-convert-numeric-entity":
        "Numeric entity couldn't be converted to character " +
	    "(codepoint U+%(charAsInt)08x).",
        "illegal-codepoint-for-numeric-entity":
        "Numeric entity represents an illegal codepoint=> " +
	    "U+%(charAsInt)08x.",
        "numeric-entity-without-semicolon":
        "Numeric entity didn't end with ';'.",
        "expected-numeric-entity-but-got-eof":
        "Numeric entity expected. Got end of file instead.",
        "expected-numeric-entity":
        "Numeric entity expected but none found.",
        "named-entity-without-semicolon":
        "Named entity didn't end with ';'.",
        "expected-named-entity":
        "Named entity expected. Got none.",
        "attributes-in-end-tag":
        "End tag contains unexpected attributes.",
        "expected-tag-name-but-got-right-bracket":
        "Expected tag name. Got '>' instead.",
        "expected-tag-name-but-got-question-mark":
        "Expected tag name. Got '?' instead. (HTML doesn't " +
	    "support processing instructions.)",
        "expected-tag-name":
        "Expected tag name. Got something else instead",
        "expected-closing-tag-but-got-right-bracket":
        "Expected closing tag. Got '>' instead. Ignoring '</>'.",
        "expected-closing-tag-but-got-eof":
        "Expected closing tag. Unexpected end of file.",
        "expected-closing-tag-but-got-char":
        "Expected closing tag. Unexpected character '%(data)' found.",
        "eof-in-tag-name":
        "Unexpected end of file in the tag name.",
        "expected-attribute-name-but-got-eof":
        "Unexpected end of file. Expected attribute name instead.",
        "eof-in-attribute-name":
        "Unexpected end of file in attribute name.",
        "duplicate-attribute":
        "Dropped duplicate attribute on tag.",
        "expected-end-of-tag-name-but-got-eof":
        "Unexpected end of file. Expected = or end of tag.",
        "expected-attribute-value-but-got-eof":
        "Unexpected end of file. Expected attribute value.",
        "eof-in-attribute-value-double-quote":
        "Unexpected end of file in attribute value (\").",
        "eof-in-attribute-value-single-quote":
        "Unexpected end of file in attribute value (').",
        "eof-in-attribute-value-no-quotes":
        "Unexpected end of file in attribute value.",
        "expected-dashes-or-doctype":
        "Expected '--' or 'DOCTYPE'. Not found.",
        "incorrect-comment":
        "Incorrect comment.",
        "eof-in-comment":
        "Unexpected end of file in comment.",
        "eof-in-comment-end-dash":
        "Unexpected end of file in comment (-)",
        "unexpected-dash-after-double-dash-in-comment":
        "Unexpected '-' after '--' found in comment.",
        "eof-in-comment-double-dash":
        "Unexpected end of file in comment (--).",
        "unexpected-char-in-comment":
        "Unexpected character in comment found.",
        "need-space-after-doctype":
        "No space after literal string 'DOCTYPE'.",
        "expected-doctype-name-but-got-right-bracket":
        "Unexpected > character. Expected DOCTYPE name.",
        "expected-doctype-name-but-got-eof":
        "Unexpected end of file. Expected DOCTYPE name.",
        "eof-in-doctype-name":
        "Unexpected end of file in DOCTYPE name.",
        "eof-in-doctype":
        "Unexpected end of file in DOCTYPE.",
        "expected-space-or-right-bracket-in-doctype":
        "Expected space or '>'. Got '%(data)'",
        "unexpected-end-of-doctype":
        "Unexpected end of DOCTYPE.",
        "unexpected-char-in-doctype":
        "Unexpected character in DOCTYPE.",
        "eof-in-bogus-doctype":
        "Unexpected end of file in bogus doctype.",
        "eof-in-innerhtml":
        "Unexpected EOF in inner html mode.",
        "unexpected-doctype":
        "Unexpected DOCTYPE. Ignored.",
        "non-html-root":
        "html needs to be the first start tag.",
        "expected-doctype-but-got-eof":
        "Unexpected End of file. Expected DOCTYPE.",
        "unknown-doctype":
        "Erroneous DOCTYPE.",
        "expected-doctype-but-got-chars":
        "Unexpected non-space characters. Expected DOCTYPE.",
        "expected-doctype-but-got-start-tag":
        "Unexpected start tag (%(name)). Expected DOCTYPE.",
        "expected-doctype-but-got-end-tag":
        "Unexpected end tag (%(name)). Expected DOCTYPE.",
        "end-tag-after-implied-root":
        "Unexpected end tag (%(name)) after the (implied) root element.",
        "expected-named-closing-tag-but-got-eof":
        "Unexpected end of file. Expected end tag (%(name)).",
        "two-heads-are-not-better-than-one":
        "Unexpected start tag head in existing head. Ignored.",
        "unexpected-end-tag":
        "Unexpected end tag (%(name)). Ignored.",
        "unexpected-start-tag-out-of-my-head":
        "Unexpected start tag (%(name)) that can be in head. Moved.",
        "unexpected-start-tag":
        "Unexpected start tag (%(name)).",
        "missing-end-tag":
        "Missing end tag (%(name)).",
        "missing-end-tags":
        "Missing end tags (%(name)).",
        "unexpected-start-tag-implies-end-tag":
        "Unexpected start tag (%(startName)) " +
	    "implies end tag (%(endName)).",
        "unexpected-start-tag-treated-as":
        "Unexpected start tag (%(originalName)). Treated as %(newName).",
        "deprecated-tag":
        "Unexpected start tag %(name). Don't use it!",
        "unexpected-start-tag-ignored":
        "Unexpected start tag %(name). Ignored.",
        "expected-one-end-tag-but-got-another":
        "Unexpected end tag (%(gotName). " +
	    "Missing end tag (%(expectedName)).",
        "end-tag-too-early":
        "End tag (%(name)) seen too early. Expected other end tag.",
        "end-tag-too-early-named":
        "Unexpected end tag (%(gotName)). Expected end tag (%(expectedName).",
        "end-tag-too-early-ignored":
        "End tag (%(name)) seen too early. Ignored.",
        "adoption-agency-1.1":
        "End tag (%(name) violates step 1, " +
	    "paragraph 1 of the adoption agency algorithm.",
        "adoption-agency-1.2":
        "End tag (%(name) violates step 1, " +
	    "paragraph 2 of the adoption agency algorithm.",
        "adoption-agency-1.3":
        "End tag (%(name) violates step 1, " +
	    "paragraph 3 of the adoption agency algorithm.",
        "unexpected-end-tag-treated-as":
        "Unexpected end tag (%(originalName)). Treated as %(newName).",
        "no-end-tag":
        "This element (%(name)) has no end tag.",
        "unexpected-implied-end-tag-in-table":
        "Unexpected implied end tag (%(name)) in the table phase.",
        "unexpected-implied-end-tag-in-table-body":
        "Unexpected implied end tag (%(name)) in the table body phase.",
        "unexpected-char-implies-table-voodoo":
        "Unexpected non-space characters in " +
	    "table context caused voodoo mode.",
        "unpexted-hidden-input-in-table":
        "Unexpected input with type hidden in table context.",
        "unexpected-start-tag-implies-table-voodoo":
        "Unexpected start tag (%(name)) in " +
	    "table context caused voodoo mode.",
        "unexpected-end-tag-implies-table-voodoo":
        "Unexpected end tag (%(name)) in " +
	    "table context caused voodoo mode.",
        "unexpected-cell-in-table-body":
        "Unexpected table cell start tag (%(name)) " +
	    "in the table body phase.",
        "unexpected-cell-end-tag":
        "Got table cell end tag (%(name)) " +
	    "while required end tags are missing.",
        "unexpected-end-tag-in-table-body":
        "Unexpected end tag (%(name)) in the table body phase. Ignored.",
        "unexpected-implied-end-tag-in-table-row":
        "Unexpected implied end tag (%(name)) in the table row phase.",
        "unexpected-end-tag-in-table-row":
        "Unexpected end tag (%(name)) in the table row phase. Ignored.",
        "unexpected-select-in-select":
        "Unexpected select start tag in the select phase " +
	    "treated as select end tag.",
        "unexpected-input-in-select":
        "Unexpected input start tag in the select phase.",
        "unexpected-start-tag-in-select":
        "Unexpected start tag token (%(name)) in the select phase. " +
	    "Ignored.",
        "unexpected-end-tag-in-select":
        "Unexpected end tag (%(name)) in the select phase. Ignored.",
        "unexpected-table-element-start-tag-in-select-in-table":
        "Unexpected table element start tag (%(name))s in the select in table phase.",
        "unexpected-table-element-end-tag-in-select-in-table":
        "Unexpected table element end tag (%(name))s in the select in table phase.",
        "unexpected-char-after-body":
        "Unexpected non-space characters in the after body phase.",
        "unexpected-start-tag-after-body":
        "Unexpected start tag token (%(name))" +
	    "in the after body phase.",
        "unexpected-end-tag-after-body":
        "Unexpected end tag token (%(name))" +
	    " in the after body phase.",
        "unexpected-char-in-frameset":
        "Unepxected characters in the frameset phase. Characters ignored.",
        "unexpected-start-tag-in-frameset":
        "Unexpected start tag token (%(name))" +
	    " in the frameset phase. Ignored.",
        "unexpected-frameset-in-frameset-innerhtml":
        "Unexpected end tag token (frameset " +
	    "in the frameset phase (innerHTML).",
        "unexpected-end-tag-in-frameset":
        "Unexpected end tag token (%(name))" +
	    " in the frameset phase. Ignored.",
        "unexpected-char-after-frameset":
        "Unexpected non-space characters in the " +
	    "after frameset phase. Ignored.",
        "unexpected-start-tag-after-frameset":
        "Unexpected start tag (%(name))" +
	    " in the after frameset phase. Ignored.",
        "unexpected-end-tag-after-frameset":
        "Unexpected end tag (%(name))" +
	    " in the after frameset phase. Ignored.",
        "expected-eof-but-got-char":
        "Unexpected non-space characters. Expected end of file.",
        "expected-eof-but-got-char":
        "Unexpected non-space characters. Expected end of file.",
        "expected-eof-but-got-start-tag":
        "Unexpected start tag (%(name))" +
	    ". Expected end of file.",
        "expected-eof-but-got-end-tag":
        "Unexpected end tag (%(name))" +
	    ". Expected end of file.",
        "unexpected-end-table-in-caption":
        "Unexpected end table tag in caption. Generates implied end caption.",
        "end-html-in-innerhtml": 
        "Unexpected html end tag in inner html mode.",
        "expected-self-closing-tag":
        "Expected a > after the /.",
        "self-closing-end-tag":
        "Self closing end tag.",
        "eof-in-table":
        "Unexpected end of file. Expected table content.",
        "html-in-foreign-content":
        "HTML start tag \"%(name)\" in a foreign namespace context.",
        "unexpected-start-tag-in-table":
        "Unexpected %(name). Expected table content."
    };

    var Models = {PCDATA: 0, RCDATA: 1, CDATA: 2};

    var TAGMODES = {
        select: 'inSelect',
        td: 'inCell',
        th: 'inCell',
        tr: 'inRow',
        tbody: 'inTableBody',
        thead: 'inTableBody',
        tfoot: 'inTableBody',
        caption: 'inCaption',
        colgroup: 'inColumnGroup',
        table: 'inTable',
        head: 'inBody',
        body: 'inBody',
        frameset: 'inFrameset'
    };

    var SVGAttributeMap = {
        attributename:	'attributeName',
        attributetype:	'attributeType',
        basefrequency:	'baseFrequency',
        baseprofile:	'baseProfile',
        calcmode:	'calcMode',
        clippathunits:	'clipPathUnits',
        contentscripttype:	'contentScriptType',
        contentstyletype:	'contentStyleType',
        diffuseconstant:	'diffuseConstant',
        edgemode:	'edgeMode',
        externalresourcesrequired:	'externalResourcesRequired',
        filterres:	'filterRes',
        filterunits:	'filterUnits',
        glyphref:	'glyphRef',
        gradienttransform:	'gradientTransform',
        gradientunits:	'gradientUnits',
        kernelmatrix:	'kernelMatrix',
        kernelunitlength:	'kernelUnitLength',
        keypoints:	'keyPoints',
        keysplines:	'keySplines',
        keytimes:	'keyTimes',
        lengthadjust:	'lengthAdjust',
        limitingconeangle:	'limitingConeAngle',
        markerheight:	'markerHeight',
        markerunits:	'markerUnits',
        markerwidth:	'markerWidth',
        maskcontentunits:	'maskContentUnits',
        maskunits:	'maskUnits',
        numoctaves:	'numOctaves',
        pathlength:	'pathLength',
        patterncontentunits:	'patternContentUnits',
        patterntransform:	'patternTransform',
        patternunits:	'patternUnits',
        pointsatx:	'pointsAtX',
        pointsaty:	'pointsAtY',
        pointsatz:	'pointsAtZ',
        preservealpha:	'preserveAlpha',
        preserveaspectratio:	'preserveAspectRatio',
        primitiveunits:	'primitiveUnits',
        refx:	'refX',
        refy:	'refY',
        repeatcount:	'repeatCount',
        repeatdur:	'repeatDur',
        requiredextensions:	'requiredExtensions',
        requiredfeatures:	'requiredFeatures',
        specularconstant:	'specularConstant',
        specularexponent:	'specularExponent',
        spreadmethod:	'spreadMethod',
        startoffset:	'startOffset',
        stddeviation:	'stdDeviation',
        stitchtiles:	'stitchTiles',
        surfacescale:	'surfaceScale',
        systemlanguage:	'systemLanguage',
        tablevalues:	'tableValues',
        targetx:	'targetX',
        targety:	'targetY',
        textlength:	'textLength',
        viewbox:	'viewBox',
        viewtarget:	'viewTarget',
        xchannelselector:	'xChannelSelector',
        ychannelselector:	'yChannelSelector',
        zoomandpan:	'zoomAndPan'
    };

    // html5/buffer.js
    function Buffer(data) {
        this.data = data || '';
        this.data += EOF;
        this.start = this.committed = 0;
    }

    Buffer.prototype = {
        slice: function() {
	    if(this.start >= this.data.length) {
	        return EOF;
	    }
	    return this.data.slice(this.start, this.data.length);
        },
        char: function() {
	    if(this.start >= this.data.length) {
	        return "\0";
	    }
	    return this.data[this.start++];
        },
        advance: function(amount) {
	    this.start += amount;
	    if(this.start < this.data.length) {	
	        if(this.committed > this.data.length / 2) {
		    // Sliiiide
		    this.data = this.data.slice(this.committed);
		    this.start = this.start - this.committed;
		    this.committed = 0;
	        }
	    }
        },
        matchWhile: function(re) {
	    if(this.data.length == this.start) return '';
	    var r = new RegExp("^"+re+"+");
	    if(m = r.exec(this.slice())) {
	        this.advance(m[0].length);
	        return m[0];
	    } else {
	        return '';
	    }
        },
        matchUntil: function(re) {
	    if(m = new RegExp(re + ("|\0")).exec(this.slice())) {
	        var t = this.data.slice(this.start, this.start + m.index);
	        this.advance(m.index);
	        return t.toString();
	    } else {
	        return '';
	    }
        },
        append: function(data) {
	    this.data += data
        },
        shift: function(n) {
	    var d = this.data.slice(this.start, this.start + n).toString();
	    this.advance(Math.min(n, this.data.length - this.start));
	    return d;
        },
        peek: function(n) {
	    return this.data.slice(this.start, Math.min(this.start + n, this.data.length)).toString();
        },
        length: function() {
	    return this.data.length - this.start - 1;
        },
        unget: function(d) {
	    this.start -= (d.length);
        },
        undo: function() {
	    this.start = this.committed;
        },
        commit: function() {
	    this.committed = this.start;
        }
    }

    // html5/tokenizer.js
    var Tokenizer = function Tokenizer(input, tokenCallback)
    {
        if(!input) throw(new Error("No input given"));
        var content_model;
        this.tokenCallback = tokenCallback;
        this.__defineSetter__('content_model', function(model) {
	    debug('tokenizer.content_model=', model)
	    content_model = model;
        })
        this.__defineGetter__('content_model', function() {
	    return content_model
        })
        this.content_model = Models.PCDATA;
        var state;
        var buffer = this.buffer = new Buffer(input);
        this.__defineSetter__('state', function(newstate) {
	    debug('tokenizer.state=', newstate)
	    state = newstate;
	    buffer.commit();
        });
        this.__defineGetter__('state', function() { return state; });
        this.state = 'data_state';
        this.escapeFlag = false;
        this.lastFourChars = '';
        this.current_token = null;
        
        this.commit = function() {
	    buffer.commit();
        };
    }

    Tokenizer.prototype.tokenize = function() {
        while(this[this.state](this.buffer)) /*empty*/;
    }

    Tokenizer.prototype.emitToken = function(tok) { 
        tok = this.normalize_token(tok);
        debug('tokenizer.token', tok)
        this.tokenCallback(tok);
    }

    Tokenizer.prototype.consume_entity = function(buffer, from_attr) {
        var char = null;
        var chars = buffer.char();
        if(chars == EOF) return false;
        if(chars.match(SPACE_CHARACTERS) || chars == '<' || chars == '&') {
	    buffer.unget(chars);
        } else if(chars[0] == '#') { // Maybe a numeric entity
	    var c = buffer.shift(2);
	    chars += c;
	    if(chars[1] && chars[1].toLowerCase() == 'x' && HEX_DIGITS_R.test(chars[2])) {
	        // Hex entity
	        buffer.unget(chars[2]);
	        char = this.consume_numeric_entity(buffer, true);
	    } else if(chars[1] && DIGITS_R.test(chars[1])) {
	        // Decimal entity
	        buffer.unget(chars.slice(1));
	        char = this.consume_numeric_entity(buffer, false);
	    } else {
	        // Not numeric
	        buffer.unget(chars);
	        this.parse_error("expected-numeric-entity");
	    }
        } else {
	    var filteredEntityList = Object.keys(ENTITIES).filter(function(e) {
	        return e[0] == chars[0];
	    });
	    var entityName = null;
	    while(true) {
	        if(filteredEntityList.some(function(e) {
		    return e.indexOf(chars) == 0;
	        })) {
		    filteredEntityList = filteredEntityList.filter(function(e) {
		        return e.indexOf(chars) == 0;
		    });
		    chars += buffer.char()
	        } else {
		    break;
	        }

	        if(ENTITIES[chars]) {
		    entityName = chars;
		    if(entityName[entityName.length - 1] == ';') break;
	        }
	    } 

	    if(entityName) {
	        char = ENTITIES[entityName];

	        if(entityName[entityName.length - 1] != ';' && this.from_attribute && (ASCII_LETTERS_R.test(chars.substr(entityName.length, 1) || DIGITS.test(chars.substr(entityName.length, 1))))) {
		    buffer.unget(chars);
		    char = '&';
	        } else {
		    buffer.unget(chars.slice(entityName.length));
	        }
	    } else {
	        this.parse_error("expected-named-entity");
	        buffer.unget(chars);
	    }
        }

        return char;
    }

    Tokenizer.prototype.consume_numeric_entity = function(buffer, hex) {
        if(hex) {
	    var allowed = HEX_DIGITS_R;
	    var radix = 16;
        } else {
	    var allowed = DIGITS_R;
	    var radix = 10;
        }

        chars = '';

        var c = buffer.char();
        while(allowed.test(c)) {
	    chars = chars + c;
	    c = buffer.char();
        }

        var charAsInt = parseInt(chars, radix);

        if(charAsInt == 13) {
	    this.parse_error("incorrect-cr-newline-entity");
	    charAsInt = 10;
        } else if(charAsInt >= 128 && charAsInt <= 159) {
	    this.parse_error("illegal-windows-1252-entity");
	    charAsInt = ENTITIES_WINDOWS1252[charAsInt - 128];
        } 
        
        if(0 < charAsInt && charAsInt <= 1114111 && !(55296 <= charAsInt && charAsInt <= 57343)) {
	    char = String.fromCharCode(charAsInt);
        } else {
	    char = String.fromCharCode(0xFFFD);
	    this.parse_error("cant-convert-numeric-entity");
        } 

        if(c != ';') {
	    this.parse_error("numeric-entity-without-semicolon");
	    buffer.unget(c);
        } 

        return char;
    }

    Tokenizer.prototype.process_entity_in_attribute = function(buffer) {
        var entity = this.consume_entity(buffer);
        if(entity) {
	    this.current_token.data.last().nodeValue += entity;
        } else {
	    this.current_token.data.last().nodeValue += '&';
        }
    }

    Tokenizer.prototype.process_solidus_in_tag = function(buffer) {
        var data = buffer.peek(1);
        if(this.current_token.type == 'StartTag' && data == '>') {
	    this.current_token.type = 'EmptyTag';
	    return true;
        } else {
	    this.parse_error("incorrectly-placed-solidus");
	    return false;
        }
    }

    Tokenizer.prototype.data_state = function(buffer) {
        var c = buffer.char()
        if(c != EOF && this.content_model == Models.CDATA || this.content_model == Models.RCDATA) {
	    this.lastFourChars += c;
	    if(this.lastFourChars.length >= 4) {
	        this.lastFourChars = this.lastFourChars.substr(-4)
	    }
        }

        if(c == EOF) {
	    this.emitToken(EOF_TOK);
	    this.commit();
	    return false;
        } else if(c == '&' && (this.content_model == Models.PCDATA || this.content_model == Models.RCDATA) && !this.escapeFlag) {
	    this.state = 'entity_data_state';
        } else if(c == '-' && (this.content_model == Models.CDATA || this.content_model == Models.RCDATA) && !this.escapeFlag && this.lastFourChars == '<!--') {
	    this.escapeFlag = true;
	    this.emitToken({type: 'Characters', data: c});
	    this.commit();
        } else if(c == '<' && !this.escapeFlag && (this.content_model == Models.PCDATA || this.content_model == Models.RCDATA || this.content_model == Models.CDATA)) {
	    this.state = 'tag_open_state';
        } else if(c == '>' && this.escapeFlag && (this.content_model == Models.CDATA || this.content_model == Models.RCDATA) && this.lastFourChars.match(/-->$/)) {
	    this.escapeFlag = false;
	    this.emitToken({type: 'Characters', data: c});
	    this.commit();
        } else if(SPACE_CHARACTERS_R.test(c)) {
	    this.emitToken({type: 'SpaceCharacters', data: c + buffer.matchWhile(SPACE_CHARACTERS_R)});
	    this.commit();
        } else {
	    var o = buffer.matchUntil("[&<>-]")
	    this.emitToken({type: 'Characters', data: c + o});
	    this.lastFourChars += c+o
	    this.lastFourChars = this.lastFourChars.slice(-4)
	    this.commit();
        }
        return true;
    }

    Tokenizer.prototype.entity_data_state = function(buffer) {
        var entity = this.consume_entity(buffer);
        if(entity) {
	    this.emitToken({type: 'Characters', data: entity});
        } else {
	    this.emitToken({type: 'Characters', data: '&'});
        }
        this.state = 'data_state';
        return true;
    }

    Tokenizer.prototype.tag_open_state = function(buffer) {
        var data = buffer.char();
        if(this.content_model == Models.PCDATA) {
	    if(data == '!') {
	        this.state = 'markup_declaration_open_state';
	    } else if (data == '/') {
	        this.state = 'close_tag_open_state';
	    } else if (data != EOF && ASCII_LETTERS_R.test(data)) {
	        this.current_token = {type: 'StartTag', name: data, data: []};
	        this.state = 'tag_name_state';
	    } else if (data == '>') {
	        // XXX In theory it could be something besides a tag name. But
	        // do we really care?
	        this.parse_error("expected-tag-name-but-got-right-bracket");
	        this.emitToken({type: 'Characters', data: "<>"});
	        this.state = 'data_state';
	    } else if (data == '?') {
	        // XXX In theory it could be something besides a tag name. But
	        // do we really care?
	        this.parse_error("expected-tag-name-but-got-question-mark");
	        buffer.unget(data);
	        this.state = 'bogus_comment_state';
	    } else {
	        // XXX
	        this.parse_error("expected-tag-name");
	        this.emitToken({type: 'Characters', data: "<"});
	        buffer.unget(data);
	        this.state = 'data_state';
	    }
        } else {
	    // We know the content model flag is set to either RCDATA or CDATA
	    // now because this state can never be entered with the PLAINTEXT
	    // flag.
	    if (data == '/') {
	        this.state = 'close_tag_open_state';
	    } else {
	        this.emitToken({type: 'Characters', data: "<"});
	        buffer.unget(data);
	        this.state = 'data_state';
	    }
        }
        return true
    }

    Tokenizer.prototype.close_tag_open_state = function(buffer) {
        if(this.content_model == Models.RCDATA || this.content_model == Models.CDATA) {
	    var chars = '';
	    if(this.current_token) {
	        for(var i = 0; i <= this.current_token.name.length; i++) {
		    var c = buffer.char();
		    chars += c;
		    if(c == EOF) break;
	        }
	        buffer.unget(chars);
	    }

	    if(this.current_token
	       && this.current_token.name.toLowerCase() == chars.slice(0, this.current_token.name.length).toLowerCase()
	       && (chars.length > this.current_token.name.length ? new RegExp('[' + SPACE_CHARACTERS_IN + '></\0]').test(chars.substr(-1)) : true)
	      ) {
	        this.content_model = Models.PCDATA;
	    } else {
	        this.emitToken({type: 'Characters', data: '</'});
	        this.state = 'data_state';
	        return true
	    }
        }

        data = buffer.char()
        if (data == EOF) { 
	    this.parse_error("expected-closing-tag-but-got-eof");
	    this.emitToken({type: 'Characters', data: '</'});
	    buffer.unget(data);
	    this.state = 'data_state'
        } else if (ASCII_LETTERS_R.test(data)) {
	    this.current_token = {type: 'EndTag', name: data, data: []}
	    this.state = 'tag_name_state';
        } else if (data == '>') {
	    this.parse_error("expected-closing-tag-but-got-right-bracket");
	    this.state = 'data_state';
        } else {
	    this.parse_error("expected-closing-tag-but-got-char", {data: data}); // param 1 is datavars:
	    buffer.unget(data);
	    this.state = 'bogus_comment_state';
        }
        return true;
    }

    Tokenizer.prototype.tag_name_state = function(buffer) {
        data = buffer.char();
        if(data == EOF) {
	    this.parse_error('eof-in-tag-name');
	    this.emit_current_token();
        } else if(SPACE_CHARACTERS_R.test(data)) {
	    this.state = 'before_attribute_name_state';
        } else if(ASCII_LETTERS_R.test(data)) {
	    this.current_token.name += data + buffer.matchWhile(ASCII_LETTERS);
        } else if(data == '>') {
	    this.emit_current_token();
        } else if(data == '/') {
	    this.process_solidus_in_tag(buffer)
	    this.state = 'self_closing_tag_state';
        } else { 
	    this.current_token.name += data;
        }
        this.commit();

        return true;
    }

    Tokenizer.prototype.before_attribute_name_state = function(buffer) {
        var data = buffer.shift(1);
        if(SPACE_CHARACTERS_R.test(data)) {
	    buffer.matchWhile(SPACE_CHARACTERS);
        } else if (data == EOF) {
	    this.parse_error("expected-attribute-name-but-got-eof");
	    this.emit_current_token();
        } else if (ASCII_LETTERS_R.test(data)) {
	    this.current_token.data.push({nodeName: data, nodeValue: ""});
	    this.state = 'attribute_name_state';
        } else if(data == '>') {
	    this.emit_current_token();
        } else if(data == '/') {
	    this.state = 'self_closing_tag_state';
        } else if(data == "'" || data == '"' || data == '=') {
	    this.parse_error("invalid-character-in-attribute-name");
	    this.current_token.data.push({nodeName: data, nodeValue: ""});
	    this.state = 'attribute_name_state';
        } else {
	    this.current_token.data.push({nodeName: data, nodeValue: ""});
	    this.state = 'attribute_name_state';
        }
        return true;
    }

    Tokenizer.prototype.attribute_name_state = function(buffer) {
        var data = buffer.shift(1);
        var leavingThisState = true;
        var emitToken = false;
        if(data == '=') {
	    this.state = 'before_attribute_value_state';
        } else if(data == EOF) {
	    this.parse_error("eof-in-attribute-name");
	    this.state = 'data_state';
	    emitToken = true;
        } else if(ASCII_LETTERS_R.test(data)) {
	    this.current_token.data.last().nodeName += data + buffer.matchWhile(ASCII_LETTERS_R);
	    leavingThisState = false;
        } else if(data == '>') {
	    // XXX If we emit here the attributes are converted to a dict
	    // without being checked and when the code below runs we error
	    // because data is a dict not a list
	    emitToken = true;
        } else if(SPACE_CHARACTERS_R.test(data)) {
	    this.state = 'after_attribute_name_state';
        } else if(data == '/') {
	    if(!this.process_solidus_in_tag(buffer)) {
	        this.state = 'before_attribute_name_state';
	    }
        } else if(data == "'" || data == '"') {
	    this.parse_error("invalid-character-in-attribute-name");
	    this.current_token.data.last().nodeName += data;
	    leavingThisState = false;
        } else {
	    this.current_token.data.last().nodeName += data;
	    leavingThisState = false;
        }

        if(leavingThisState) {
	    // Attributes are not dropped at this stage. That happens when the
	    // start tag token is emitted so values can still be safely appended
	    // to attributes, but we do want to report the parse error in time.
	    if(this.lowercase_attr_name) {
	        this.current_token.data.last().nodeName = this.current_token.data.last().nodeName.toLowerCase();
	    }
	    for (k in this.current_token.data.slice(0, -1)) {
	        // FIXME this is a fucking mess.
	        if(this.current_token.data.slice(-1)[0] == this.current_token.data.slice(0, -1)[k].name) {
		    this.parse_error("duplicate-attribute");
		    break; // Don't emit more than one of these errors
	        }
	    }
	    if(emitToken) this.emit_current_token();
        } else {
	    this.commit()
        }
        return true;
    }

    Tokenizer.prototype.after_attribute_name_state = function(buffer) {
        var data = buffer.shift(1);
        if(SPACE_CHARACTERS_R.test(data)) {
	    buffer.matchWhile(SPACE_CHARACTERS_R);
        } else if(data == '=') {
	    this.state = 'before_attribute_value_state';
        } else if(data == '>') {
	    this.emit_current_token();
        } else if(data == EOF) {
	    this.parse_error("expected-end-of-tag-but-got-eof");
	    this.emit_current_token();
        } else if(ASCII_LETTERS_R.test(data)) {
	    this.current_token.data.push({nodeName: data, nodeValue: ""});
	    this.state = 'attribute_name_state';
        } else if(data == '/') {
	    this.state = 'self_closing_tag_state';
        } else {
	    this.current_token.data.push({nodeName: data, nodeValue: ""});
	    this.state = 'attribute_name_state';
        }
        return true;
    }

    Tokenizer.prototype.before_attribute_value_state = function(buffer) {
        var data = buffer.shift(1);
        if(SPACE_CHARACTERS_R.test(data)) {
	    buffer.matchWhile(SPACE_CHARACTERS_R);
        } else if(data == '"') {
	    this.state = 'attribute_value_double_quoted_state';
        } else if(data == '&') {
	    this.state = 'attribute_value_unquoted_state';
	    buffer.unget(data);
        } else if(data == "'") {
	    this.state = 'attribute_value_single_quoted_state';
        } else if(data == '>') {
	    this.emit_current_token();
        } else if(data == '=') {
	    this.parse_error("equals-in-unquoted-attribute-value");
	    this.current_token.data.last().nodeValue += data;
	    this.state = 'attribute_value_unquoted_state';
        } else if(data == EOF) {
	    this.parse_error("expected-attribute-value-but-got-eof");
	    this.emit_current_token();
	    this.state = 'attribute_value_unquoted_state';
        } else {
	    this.current_token.data.last().nodeValue += data
	    this.state = 'attribute_value_unquoted_state'
        }

        return true;
    }

    Tokenizer.prototype.attribute_value_double_quoted_state = function(buffer) {
        var data = buffer.shift(1);
        if(data == '"') {
	    this.state = 'after_attribute_value_state';
        } else if(data == '&') {
	    this.process_entity_in_attribute(buffer);
        } else if(data == EOF) {
	    this.parse_error("eof-in-attribute-value-double-quote");
	    this.emit_current_token();
        } else {
	    this.current_token.data.last().nodeValue += data + buffer.matchUntil('["&]');
        }
        return true;
    }

    Tokenizer.prototype.attribute_value_single_quoted_state = function(buffer) {
        var data = buffer.shift(1);
        if(data == "'") {
	    this.state = 'after_attribute_value_state';
        } else if(data == '&') {
	    this.process_entity_in_attribute(buffer);
        } else if(data == EOF) {
	    this.parse_error("eof-in-attribute-value-single-quote");
	    this.emit_current_token();
        } else {
	    this.current_token.data.last().nodeValue += data + buffer.matchUntil("['&]");
        }
        return true;
    }

    Tokenizer.prototype.attribute_value_unquoted_state = function(buffer) {
        var data = buffer.shift(1);
        if(SPACE_CHARACTERS_R.test(data)) {
	    this.state = 'before_attribute_name_state';
        } else if(data == '&') {
	    this.process_entity_in_attribute(buffer);
        } else if(data == '>') {
	    this.emit_current_token();
        } else if(data == '"' || data == "'" || data == '=') {
	    this.parse_error("unexpected-character-in-unquoted-attribute-value");
	    this.current_token.data.last().nodeValue += data;
        } else if(data == EOF) {
	    this.parse_error("eof-in-attribute-value-no-quotes");
	    this.emit_current_token();
        } else {
	    var o = buffer.matchUntil("["+ SPACE_CHARACTERS_IN + '&<>' +"]")
	    this.current_token.data.last().nodeValue += data + o
        }
        return true;
    }

    Tokenizer.prototype.after_attribute_value_state = function(buffer) {
        var data = buffer.shift(1);
        if(SPACE_CHARACTERS_R.test(data)) {
	    this.state = 'before_attribute_name_state';
        } else if(data == '>') {
	    this.emit_current_token();
	    this.state = 'data_state';
        } else if(data == '/') {
	    this.state = 'self_closing_tag_state';
        } else if(data == EOF) {
	    this.parse_error( "unexpected-EOF-after-attribute-value");
	    this.emit_current_token();
	    buffer.unget(data);
	    this.state = 'data_state';
        } else {
	    this.emitToken({type: 'ParseError', data: "unexpected-character-after-attribute-value"});
	    buffer.unget(data);
	    this.state = 'before_attribute_name_state';
        }
        return true;
    }

    Tokenizer.prototype.self_closing_tag_state = function(buffer) {
        var c = buffer.shift(1);
        if(c == '>') {
	    this.current_token.self_closing = true; 
	    this.emit_current_token();
	    this.state = 'data_state';
        } else if(c == EOF) {
	    this.parse_error("eof-in-tag-name");
	    buffer.unget(c);
	    this.state = 'data_state';
        } else {
	    this.parse_error("expected-self-closing-tag");
	    buffer.unget(c);
	    this.state = 'before_attribute_name_state';
        }
        return true;
    }

    Tokenizer.prototype.bogus_comment_state = function(buffer) {
        var tok = {type: 'Comment', data: buffer.matchUntil('>')}
        buffer.char()
        this.emitToken(tok);
        this.state = 'data_state';
        return true;
    }

    Tokenizer.prototype.markup_declaration_open_state = function(buffer) {
        var chars = buffer.shift(2);
        if(chars == '--') {
	    this.current_token = {type: 'Comment', data: ''};
	    this.state = 'comment_start_state';
        } else {
	    var newchars = buffer.shift(5);
	    if(newchars == EOF || chars == EOF) {
                this.parse_error("expected-dashes-or-doctype");
	        this.state = 'bogus_comment_state'
	        if(chars != EOF) buffer.unget(chars);
	        return true;
	    }

	    // Check for EOF better -- FIXME
	    chars += newchars;
	    if(chars.toUpperCase() == 'DOCTYPE') {
	        this.current_token = {type: 'Doctype', name: '', publicId: null, systemId: null, correct: true};
	        this.state = 'doctype_state';
	    } else {
	        this.parse_error("expected-dashes-or-doctype");
	        buffer.unget(chars);
	        this.state = 'bogus_comment_state';
	    }
        }
        return true;
    }

    Tokenizer.prototype.comment_start_state = function(buffer) {
        var data = buffer.shift(1);
        if(data == '-') {
	    this.state = 'comment_start_dash_state';
        } else if(data == '>') {
	    this.parse_error("incorrect comment");
	    this.emitToken(this.current_token);
	    this.state = 'data_state';
        } else if(data == EOF) {
	    this.parse_error("eof-in-comment");
	    this.emitToken(this.current_token);
	    this.state = 'data_state';
        } else {
	    this.current_token.data += data + buffer.matchUntil('-');
	    this.state = 'comment_state';
        }
        return true;
    }

    Tokenizer.prototype.comment_start_dash_state = function(buffer) {
        var data = buffer.shift(1);
        if(data == '-') {
	    this.state = 'comment_end_state'
        } else if(data == '>') {
	    this.parse_error("incorrect-comment");
	    this.emitToken(this.current_token);
	    this.state = 'data_state';
        } else if(data == EOF) {
	    this.parse_error("eof-in-comment");
	    this.emitToken(this.current_token);
	    this.state = 'data_state';
        } else {
	    this.current_token.data += '-' + data + buffer.matchUntil('-');
	    this.state = 'comment_state';
        }
        return true;
    }

    Tokenizer.prototype.comment_state = function(buffer) {
        var data = buffer.shift(1);
        if(data == '-') {
	    this.state = 'comment_end_dash_state';
        } else if(data == EOF) {
	    this.parse_error("eof-in-comment");
	    this.emitToken(this.current_token);
	    this.state = 'data_state';
        } else {
	    this.current_token.data += data + buffer.matchUntil('-');
        }
        return true;
    }

    Tokenizer.prototype.comment_end_dash_state = function(buffer) {
        var data = buffer.char();
        if(data == '-') {
	    this.state = 'comment_end_state';
        } else if (data == EOF) {
	    this.parse_error("eof-in-comment-end-dash");
	    this.emitToken(this.current_token);
	    this.state = 'data_state';
        } else {
	    this.current_token.data += '-' + data + buffer.matchUntil('-');
	    // Consume the next character which is either a "-" or an :EOF as
	    // well so if there's a "-" directly after the "-" we go nicely to
	    // the "comment end state" without emitting a ParseError there.
	    buffer.char();
        }
        return true;
    }

    Tokenizer.prototype.comment_end_state = function(buffer) {
        var data = buffer.shift(1);
        if(data == '>') {
	    this.emitToken(this.current_token);
	    this.state = 'data_state';
        } else if(data == '-') {
	    this.parse_error("unexpected-dash-after-double-dash-in-comment");
	    this.current_token.data += data;
        } else if (data == EOF) {
	    this.parse_error("eof-in-comment-double-dash");
	    this.emitToken(this.current_token);
	    this.state = 'data_state';
        } else {
	    // XXX
	    this.parse_error("unexpected-char-in-comment");
	    this.current_token.data += '--' + data;
	    this.state = 'comment_state';
        }
        return true;
    }

    Tokenizer.prototype.doctype_state = function(buffer) {
        var data = buffer.shift(1);
        if(SPACE_CHARACTERS_R.test(data)) {
	    this.state = 'before_doctype_name_state';
        } else {
	    this.parse_error("need-space-after-doctype");
	    buffer.unget(data);
	    this.state = 'before_doctype_name_state';
        }
        return true;
    }

    Tokenizer.prototype.before_doctype_name_state = function(buffer) {
        var data = buffer.shift(1);
        if(SPACE_CHARACTERS_R.test(data)) {
        } else if(data == '>') {
	    this.parse_error("expected-doctype-name-but-got-right-bracket");
	    this.current_token.correct = false;
	    this.emit_current_token();
	    this.state = 'data_state';
        } else if(data == EOF) {
	    this.parse_error("expected-doctype-name-but-got-eof");
	    this.current_token.correct = false;
	    this.emit_current_token();
	    this.state = 'data_state';
        } else {
	    this.current_token.name = data;
	    this.state = 'doctype_name_state';
        }
        return true
    }

    Tokenizer.prototype.doctype_name_state = function(buffer) {
        var data = buffer.shift(1);
        if(SPACE_CHARACTERS_R.test(data)) {
	    this.state = 'bogus_doctype_state';
        } else if(data == '>') {
	    this.emit_current_token();
	    this.state = 'data_state';
        } else if(data == EOF) {
	    this.current_token.correct = false;
	    buffer.unget(data);
	    this.parse_error("eof-in-doctype");
	    this.emit_current_token();
	    this.state = 'data_state';
        } else {
	    this.current_token.name += data;
        }
        return true;
    }
    /*
      data += buffer.shift(5);
      var token = data.toLowerCase();
      if(token == 'public') {
      this.state = 'before_doctype_public_identifier_state';
      } else if(token == 'system') {
      this.state = 'before_doctype_system_identifier_state';
      } else {
      buffer.unget(data);
      this.parse_error("expected-space-or-right-bracket-in-doctype", {data: data});
      this.state = 'bogus_doctype_state';
      }
      }
      return true
      }
    */

    Tokenizer.prototype.bogus_doctype_state = function(buffer) {
        var data = buffer.shift(1);
        this.current_token.correct = false;
        if(data == '>') {
	    this.emit_current_token();
	    this.state = 'data_state';
        } else if(data == EOF) {
	    throw(new Error("Unimplemented!"))
        }
        return true;
    }

    Tokenizer.prototype.parse_error = function(message) {
        this.emitToken({type: 'ParseError', data: message});
    }

    Tokenizer.prototype.emit_current_token = function() {
        var tok = this.current_token;
        switch(tok.type) {
        case 'StartTag':
        case 'EndTag':
        case 'EmptyTag':
	    if(tok.type == 'EndTag' && tok.self_closing) {
	        this.parse_error('self-closing-end-tag');
	    }
	    break;
        }
        this.emitToken(tok);
        this.state = 'data_state';
    }

    Tokenizer.prototype.normalize_token = function(token) {
        if(token.type == 'EmptyTag') {
	    if(VOID_ELEMENTS.indexOf(token.name) == -1) {
	        this.parse_error('incorrectly-placed-solidus');
	    }
	    token.type = 'StartTag';
        }

        if(token.type == 'StartTag') {
	    token.name = token.name.toLowerCase();
	    if(token.data.length != 0) {
	        var data = {};
	        token.data.reverse();
	        token.data.forEach(function(e) {
		    data[e.nodeName.toLowerCase()] = e.nodeValue;
	        });
	        token.data = [];
	        for(var k in data) {
		    token.data.push({nodeName: k, nodeValue: data[k]});
	        }
	    }
        } else if(token.type == 'EndTag') {
	    if(token.data.length != 0) this.parse_error('attributes-in-end-tag');
	    token.name = token.name.toLowerCase();
        }

        return token;
    }

    // html5/treebuilder.js

    /*
     * djf: I need to replace the full DOM that TreeBuilder is trying to use
     * with a much simpler tree structure.  Every node in the tree is an object.
     * Each nodes has a type property (like DOM nodeType).
     * Other properties: 
     *   doctype (for Document nodes)
     *   tagname (for Element nodes)
     *   attributes (for elements: an object)
     *   children (for elements and documents: an array)
     *   doctype (for documents: an object)
     *   docelt (for documents: shortcut to the document element)
     *   text: for text and comments
     */ 

    var ELEMENT = 1;
    var TEXT = 3;
    var COMMENT = 8;
    var DOCUMENT = 9;
    var DOCTYPE = 10;
    var FRAGMENT = 11;

    var TreeBuilder = function TreeBuilder(document) {
        this.document = document; 
        this.open_elements = [];
        this.activeFormattingElements = [];
    }

    function appendNode(parent,child) {
        child.parent = parent;
        parent.children.push(child);
    }

    function removeNode(child) {
        if (!child.parent) return;
        var parent = child.parent;
        var pos = parent.children.indexOf(child);
        if (pos == -1) throw new Error("Can't find child in parent");
        child.parent = null;
        parent.children.splice(pos, 1);
    }

    function insertBefore(element, target) {
        var parent = target.parent;
        var kids = parent.children;
        var pos = kids.indexOf(target);
        if (pos == -1) throw new Error("insertBefore failed");
        element.parent = parent;
        kids.splice(pos, 0, element);
    }

    function hasChildNodes(e) {
        return e.children && e.children.length;
    }


    TreeBuilder.prototype.reset = function() {
    }

    TreeBuilder.prototype.createElement = function (name, attributes, namespace) {
        return {
            type: ELEMENT,
            tagname: name,
            namespace: namespace,
            attributes: attributes || [],
            children: []
        };
    }

    TreeBuilder.prototype.insert_element = function(name, attributes, namespace) {
        debug('treebuilder.insert_element', name)
        if(this.insert_from_table) {
	    return this.insert_element_from_table(name, attributes, namespace)
        } else {
	    return this.insert_element_normal(name, attributes, namespace)
        }
    }

    TreeBuilder.prototype.insert_foreign_element = function(name, attributes, namespace) {
        return this.insert_element(name, attributes, namespace);
    }

    TreeBuilder.prototype.insert_element_normal = function(name, attributes, namespace) {
        var element = this.createElement(name, attributes, namespace);
        var parent = this.open_elements.last();
        appendNode(parent, element);
        this.open_elements.push(element);
        return element;
    }

    TreeBuilder.prototype.insert_element_from_table = function(name, attributes, namespace) {
        if(TABLE_INSERT_MODE_ELEMENTS.indexOf(this.open_elements.last().tagname.toLowerCase()) != -1) {
            var element = this.createElement(name, attributes, namespace)

	    // We should be in the InTable mode. This means we want to do
	    // special magic element rearranging 
	    var t = this.getTableMisnestedNodePosition()
	    if(!t.insertBefore) {
                var parent = t.parent;
                element.parent = parent;
                parent.children.push(element);
	    } else {
                insertBefore(element, t.insertBefore);
	    }
	    this.open_elements.push(element)
            return element;
        } else {
	    return this.insert_element_normal(name, attributes, namespace);
        }
    }

    TreeBuilder.prototype.insert_comment = function(data, parent) {
        if(!parent) parent = this.open_elements.last();
        var c = {
            type: COMMENT,
            data: data,
        }
        appendNode(parent, c);
    }

    TreeBuilder.prototype.insert_doctype = function (name, publicId, systemId) {
        var doctype = {
            type: DOCTYPE,
            name: name,
            publicId: publicId,
            systemId: systemId,
        };

        appendNode(this.document, doctype);
        this.document.doctype = doctype;
    }


    TreeBuilder.prototype.insert_text = function(data, parent) {
        if(!parent) parent = this.open_elements.last();
        if(!this.insert_from_table ||
           TABLE_INSERT_MODE_ELEMENTS.indexOf(this.open_elements.last().tagName.toLowerCase()) == -1) {

            var lastkid = parent.children.last();
            if (lastkid && lastkid.type == TEXT) {
                lastkid.data += data;
            }
            else {
                appendNode(parent, {
                    type: TEXT,
                    data: data,
                });
            }
        } else {
	    // We should be in the inTable phase. This means we want to do special
	    // magic element rearranging.
	    var t = this.getTableMisnestedNodePosition();

            var parent = t.parent;
            var elt = {
                type: TEXT,
                data: data,
                parent: parent
            };
            if (t.insertBefore) {
                var pos = parent.chilren.indexOf(target);
                if (pos == -1) throw new Error("can't insert before");
                if (pos > 0 && parent.children[pos-1].type == TEXT) {
                    parent.children[pos-1].data += data;
                }
                else {
                    parent.children.splice(pos, 0, elt);
                }
            }
            else {
                appendNode(parent, elt);
            }
        }
    }

    TreeBuilder.prototype.remove_open_elements_until = function(nameOrCb) {
        debug('treebuilder.remove_open_elements_until', nameOrCb)
        var finished = false;
        while(!finished) {
	    var element = this.pop_element();
            if (typeof nameOrCb === 'string') 
                finished = (element.tagname.toLowerCase() == nameOrCb);
            else {
                finished = nameOrCb(element);
            }
        }
        return element;
    }

    TreeBuilder.prototype.pop_element = function() {
        var el = this.open_elements.pop()
        debug('treebuilder.pop_element', el.name)
        return el
    }


    TreeBuilder.prototype.getTableMisnestedNodePosition = function() {
        // The foster parent element is the one which comes before the most
        // recently opened table element
        // XXX - this is really inelegant
        var lastTable, fosterParent, insertBefore
        
        for(var i = this.open_elements.length - 1; i >= 0; i--) {
	    var element = this.open_elements[i]
	    if(element.tagname.toLowerCase() == 'table') {
	        lastTable = element
	        break
	    }
        }

        if(lastTable) {
	    // XXX - we should check that the parent really is a node here
	    if(lastTable.parent) {
	        fosterParent = lastTable.parent
	        insertBefore = lastTable
	    } else {
	        fosterParent = this.open_elements[this.open_elements.indexOf(lastTable) - 1]
	    }
        } else {
	    fosterParent = this.open_elements[0]
        }
        
        return {parent: fosterParent, insertBefore: insertBefore}
    }

    TreeBuilder.prototype.elementInScope = function(name, tableVariant) {
        if(this.open_elements.length == 0) return false
        for(var i = this.open_elements.length - 1; i >= 0; i--) {
            var tag = this.open_elements[i].tagname;
            if (tag == undefined) return false;
            tag = tag.toLowerCase();
	    if(tag == name) return true
	    else if(tag == 'table') return false
	    else if(!tableVariant && SCOPING_ELEMENTS.indexOf(tag) != -1)
                return false
	    else if(tag == 'html') return false;
        }
        return false; 
    }

    TreeBuilder.prototype.generateImpliedEndTags = function(exclude) {
        if(exclude) exclude = exclude.toLowerCase()
        if(this.open_elements.length == 0) {
	    debug('treebuilder.generateImpliedEndTags', 'no open elements')
	    return;
        }
        var name = this.open_elements.last().tagname.toLowerCase();
        if(['dd', 'dt', 'li', 'p', 'td', 'th', 'tr'].indexOf(name) != -1 && name != exclude) {
	    var p  = this.pop_element();
	    this.generateImpliedEndTags(exclude);
        }
    }

    TreeBuilder.prototype.reconstructActiveFormattingElements = function() {
        // Within this algorithm the order of steps decribed in the specification
        // is not quite the same as the order of steps in the code. It should still
        // do the same though.

        // Step 1: stop if there's nothing to do
        if(this.activeFormattingElements.length == 0) return;

        // Step 2 and 3: start with the last element
        var i = this.activeFormattingElements.length - 1;
        var entry = this.activeFormattingElements[i];
        if(entry == Marker || this.open_elements.indexOf(entry) != -1) return;

        while(entry != Marker && this.open_elements.indexOf(entry) == -1) {
	    i -= 1;
	    entry = this.activeFormattingElements[i];
	    if(!entry) break;
        }

        while(true) {
	    i += 1;
	    var clone = cloneNode(this.activeFormattingElements[i]);

	    var element = this.insert_element(clone.tagname, clone.attributes);

	    this.activeFormattingElements[i] = element;

	    if(element == this.activeFormattingElements.last()) break;
        }

    }

    // simple shallow Node clone: just copy object properties and then
    // delete the parent and children properties
    function cloneNode(o) {
        var c = {};
        for(var p in o) c[p] = o[p];
        delete c.parent;
        delete c.children;
        return c;
    }

    TreeBuilder.prototype.elementInActiveFormattingElements = function(name) {
        var els = this.activeFormattingElements;
        for(var i = els.length - 1; i >= 0; i--) {
	    if(els[i] == Marker) break;
	    if(els[i].tagname.toLowerCase() == name) return els[i];
        }
        return false;
    }

    TreeBuilder.prototype.reparentChildren = function(o, n) {
        n.children = n.children.concat(o.children);
        o.children = [];
    }

    TreeBuilder.prototype.clearActiveFormattingElements = function() {
        while(!(this.activeFormattingElements.length == 0 || this.activeFormattingElements.pop() == Marker)) /* empty */;
    }

    TreeBuilder.prototype.getFragment = function() {
        var fragment = {
            type: FRAGMENT,
            children: [],
        };

        this.reparentChildren(this.root_pointer, fragment)
        return fragment
    }

    TreeBuilder.prototype.create_structure_elements = function(container) {
        this.html_pointer = this.createElement('html');
        appendNode(this.document, this.html_pointer);

        if(container == 'html') return;

        this.head_pointer = this.createElement('head');
        appendNode(this.html_pointer, this.head_pointer);

        if(container == 'head') return;
        this.body_pointer = this.createElement('body');
        appendNode(this.html_pointer, this.body_pointer);
    }

    // html5/parser.js
    var Parser = function Parser(options) {
        this.strict = false;
        this.errors = [];
        var phase;

        this.__defineSetter__('phase', function(p) {
	    phase = p;
	    if(!p) throw( new Error("Can't leave phase undefined"));
	    if(!p instanceof Function) throw( new Error("Not a function"));
        });

        this.__defineGetter__('phase', function() {
	    return phase;
        });

        if(options) for(o in options) {
	    this[o] = options[o];
        }

    }

    Parser.prototype.parse = function(source) {
        if(!source) throw(new Error("No source to parse"));
        debug('parser.parse', source)
        this.document = {
            type: DOCUMENT,
            children:[]
        };

        this.tree = new TreeBuilder(this.document);

        var parser = this;
        this.tokenizer = new Tokenizer(source,
                                       function(t) { parser.do_token(t); });
        this.tree.reset();
        this.first_start_tag = false;
        this.errors = [];
        this.inner_html = false;
        this.newPhase('initial');
        this.last_phase = null;

        this.tokenizer.tokenize();

        return this.document;
    }

    Parser.prototype.parse_fragment = function(source, containerTagName) {
        debug('parser.parse_fragment', source, containerTagName)

        this.document = {
            type: DOCUMENT,
            children:[]
        };
        this.tree = new TreeBuilder(this.document);
        var parser = this;
        this.tokenizer = new Tokenizer(source, 
                                       function(t) { parser.do_token(t); });
        containerTagName = containerTagName || "div";

        this.tree.reset();
        this.first_start_tag = false;
        this.errors = [];
        this.inner_html = containerTagName.toLowerCase();
        switch(this.inner_html) {
        case 'title':
        case 'textarea':
	    this.tokenizer.content_model = Models.RCDATA;
	    break;
        case 'style':
        case 'script':
        case 'xmp':
        case 'iframe':
        case 'noembed':
        case 'noframes':
        case 'noscript':
	    this.tokenizer.content_model = Models.CDATA;
	    break;
        case 'plaintext':
	    this.tokenizer.content_model = Models.PLAINTEXT;
	    break;
        default:
	    this.tokenizer.content_model = Models.PCDATA;
        }

        this.tree.create_structure_elements(this.inner_html);

        switch(this.inner_html) {
        case 'html':
	    this.newPhase('afterHtml')
	    break;
        case 'head':
	    this.newPhase('inHead')
	    break;
        default:
	    this.newPhase('inBody')
        }

        this.reset_insertion_mode(this.inner_html);
        this.last_phase = null;
        this.tree.open_elements.push(this.tree.html_pointer);
        this.tree.open_elements.push(this.tree.body_pointer);
        this.tree.root_pointer = this.tree.body_pointer;

        this.tokenizer.tokenize();
        return this.tree.getFragment();
    }

    Parser.prototype.newPhase = function(name) {
        this.phase = new PHASES[name](this, this.tree);
        debug('parser.newPhase', name)
        this.phaseName = name;
    }

/*
    // convert tokenizer-style attributes (an array)
    // into tree-builder style attributes (an object)
    function convertAttributes(tokendata) {
        var result = {};
        for(var i = 0; i < tokendata.length; i++) {
            var attr = tokendata[i];
            result[attr.nodeName] = attr.nodeValue;
        }
        return result;
    }
*/

    Parser.prototype.do_token = function(token) {
        var method = 'process' + token.type;

        switch(token.type) {
        case 'Characters':
        case 'SpaceCharacters':
        case 'Comment':
	    this.phase[method](token.data);
	    break;
        case 'StartTag':
	    this.phase[method](token.name,
                               /*convertAttributes(*/token.data/*)*/,
                               token.self_closing);
	    break;
        case 'EndTag':
	    this.phase[method](token.name);
	    break;
        case 'Doctype':
	    this.phase[method](token.name, token.publicId, token.systemId, token.correct);
	    break;
        case 'EOF':
	    this.phase[method]();
	    break;
        default:
	    this.parse_error(token.data, token.datavars)
        }
    }

    Parser.prototype.parse_error = function(code, data) {
        // FIXME: this.errors.push([this.tokenizer.position, code, data]);
        this.errors.push([code, data]);
        if(this.strict) throw(this.errors.last());
    }

    Parser.prototype.reset_insertion_mode = function(context) {
        var last = false;
        var node_name;
        
        for(var i = this.tree.open_elements.length - 1; i >= 0; i--) {
	    var node = this.tree.open_elements[i]
	    node_name = node.tagname.toLowerCase()
	    if(node == this.tree.open_elements[0]) {
	        last = true
	        if(node_name != 'th' && node_name != 'td') {
		    // XXX
		    // assert.ok(this.inner_html);
		    node_name = context.tagname;
	        }
	    }

	    if(!(node_name == 'select' || node_name == 'colgroup' || node_name == 'head' || node_name == 'frameset')) {
	        // XXX
	        // assert.ok(this.inner_html)
	    }


	    if(TAGMODES[node_name]) {
	        this.newPhase(TAGMODES[node_name]);
	    } else if(node_name == 'html') {
	        this.newPhase(this.tree.head_pointer ? 'afterHead' : 'beforeHead');
	    } else if(last) {
	        this.newPhase('inBody');
	    } else {
	        continue;
	    }

	    break;
        }
    }

    /*
      Parser.prototype._ = function(str) { 
      return(str);
      }
    */


    Phase = function Phase(parser, tree) {
        this.tree = tree;
        this.parser = parser;
    }

    Phase.prototype = {
        end_tag_handlers: {"-default": 'endTagOther'},
        start_tag_handlers: {"-default": 'startTagOther'},

        parse_error: function(code, options) {
	    this.parser.parse_error(code, options);
        },
        processEOF: function() {
	    this.tree.generateImpliedEndTags();
	    if(this.tree.open_elements.length > 2) {
	        this.parse_error('expected-closing-tag-but-got-eof');
	    } else if(this.tree.open_elements.length == 2
		      && this.tree.open_elements[1].tagname.toLowerCase() != 'body') {
	        // This happens for framesets or something?
	        this.parse_error('expected-closing-tag-but-got-eof');
	    } else if(this.parser.inner_html && this.tree.open_elements.length > 1) {
	        // XXX This is not what the specification says. Not sure what to do here.
	        this.parse_error('eof-in-innerhtml');
	    }
        },
        processComment: function(data) {
	    // For most phases the following is correct. Where it's not it will be 
	    // overridden.
	    this.tree.insert_comment(data, this.tree.open_elements.last());
        },
        processDoctype: function(name, publicId, systemId, correct) {
	    this.parse_error('unexpected-doctype');
        },
        processSpaceCharacters: function(data) {
	    this.tree.insert_text(data);
        },
        processStartTag: function(name, attributes, self_closing) {
	    if(this[this.start_tag_handlers[name]]) {
	        this[this.start_tag_handlers[name]](name, attributes, self_closing);
	    } else if(this[this.start_tag_handlers["-default"]]) {
	        this[this.start_tag_handlers["-default"]](name, attributes, self_closing);
	    } else {
	        throw(new Error("No handler found for "+name));
	    }
        },
        processEndTag: function(name) {
	    if(this[this.end_tag_handlers[name]]) {
	        this[this.end_tag_handlers[name]](name);
	    } else if(this[this.end_tag_handlers["-default"]]) {
	        this[this.end_tag_handlers["-default"]](name);
	    } else {
	        throw(new Error("No handler found for "+name));
	    }
        },
        inScope: function(name, treeVariant) {
	    return this.tree.elementInScope(name, treeVariant);
        },
        startTagHtml: function(name, attributes) {
	    if(this.parser.first_start_tag == false && name == 'html') {
	        this.parse_error('non-html-root')
	    }
	    // XXX Need a check here to see if the first start tag token emitted is this token. . . if it's not, invoke parse_error.
            var html = this.tree.open_elements[0];
	    for(var i = 0; i < attributes.length; i++) {
                var alreadyhas = html.attributes.some(function(a) {
                    return a.nodeName == attributes[i].nodeName;
                });
                if (!alreadyhas) html.attributes.push(attributes[i]);
	    }
	    this.parser.first_start_tag = false;
        },
        adjust_mathml_attributes: function(attributes) {
	    return attributes.map(function(a) {
	        if(a[0] =='definitionurl') {
		    return ['definitionURL', a[1]]
	        } else {
		    return a;
	        }
	    });
        },
        adjust_svg_attributes: function(attributes) {
	    return attributes.map(function(a) {
	        return SVGAttributeMap[a] ? SVGAttributeMap[a] : a;
	    });
        },
        adjust_foreign_attributes: function (attributes) {
	    for(var i = 0; i < attributes.length; i++) {
	        if(attributes[i].nodeName.indexOf(':') != -1) {
		    var t = attributes[i].nodeName.split(/:/);
		    attributes[i].namespace = t[0];
		    attributes[i].nodeName = t[1];
	        }
	    }
	    return attributes;
        }
    }


    // 
    // This object maps parser phase names to phase-specific parser methods.
    // Below, we'll create constructor functions for each phase and make
    // these methods into prototype objects. But for now, they're just
    // sets of methods.
    //
    var PHASES =  {
        initial: {
            processEOF : function() {
	        this.parse_error("expected-doctype-but-got-eof");
	        this.parser.newPhase('beforeHTML');
	        this.parser.phase.processEOF();
            },

            processComment : function(data) {
	        this.tree.insert_comment(data, this.tree.document);
            },

            processDoctype : function(name, publicId, systemId, correct) {
	        if(name.toLowerCase() != 'html' || publicId || systemId) {
		    this.parse_error("unknown-doctype");
	        }

	        // XXX need to update DOCTYPE tokens
	        this.tree.insert_doctype(name, publicId, systemId);

	        publicId = (publicId || '').toString().toUpperCase();

	        if(name.toLowerCase() != 'html') {
		    // XXX quirks mode
	        } else {
		    if((["+//silmaril//dtd html pro v0r11 19970101//en",
		         "-//advasoft ltd//dtd html 3.0 aswedit + extensions//en",
		         "-//as//dtd html 3.0 aswedit + extensions//en",
		         "-//ietf//dtd html 2.0 level 1//en",
		         "-//ietf//dtd html 2.0 level 2//en",
		         "-//ietf//dtd html 2.0 strict level 1//en",
		         "-//ietf//dtd html 2.0 strict level 2//en",
		         "-//ietf//dtd html 2.0 strict//en",
		         "-//ietf//dtd html 2.0//en",
		         "-//ietf//dtd html 2.1e//en",
		         "-//ietf//dtd html 3.0//en",
		         "-//ietf//dtd html 3.0//en//",
		         "-//ietf//dtd html 3.2 final//en",
		         "-//ietf//dtd html 3.2//en",
		         "-//ietf//dtd html 3//en",
		         "-//ietf//dtd html level 0//en",
		         "-//ietf//dtd html level 0//en//2.0",
		         "-//ietf//dtd html level 1//en",
		         "-//ietf//dtd html level 1//en//2.0",
		         "-//ietf//dtd html level 2//en",
		         "-//ietf//dtd html level 2//en//2.0",
		         "-//ietf//dtd html level 3//en",
		         "-//ietf//dtd html level 3//en//3.0",
		         "-//ietf//dtd html strict level 0//en",
		         "-//ietf//dtd html strict level 0//en//2.0",
		         "-//ietf//dtd html strict level 1//en",
		         "-//ietf//dtd html strict level 1//en//2.0",
		         "-//ietf//dtd html strict level 2//en",
		         "-//ietf//dtd html strict level 2//en//2.0",
		         "-//ietf//dtd html strict level 3//en",
		         "-//ietf//dtd html strict level 3//en//3.0",
		         "-//ietf//dtd html strict//en",
		         "-//ietf//dtd html strict//en//2.0",
		         "-//ietf//dtd html strict//en//3.0",
		         "-//ietf//dtd html//en",
		         "-//ietf//dtd html//en//2.0",
		         "-//ietf//dtd html//en//3.0",
		         "-//metrius//dtd metrius presentational//en",
		         "-//microsoft//dtd internet explorer 2.0 html strict//en",
		         "-//microsoft//dtd internet explorer 2.0 html//en",
		         "-//microsoft//dtd internet explorer 2.0 tables//en",
		         "-//microsoft//dtd internet explorer 3.0 html strict//en",
		         "-//microsoft//dtd internet explorer 3.0 html//en",
		         "-//microsoft//dtd internet explorer 3.0 tables//en",
		         "-//netscape comm. corp.//dtd html//en",
		         "-//netscape comm. corp.//dtd strict html//en",
		         "-//o'reilly and associates//dtd html 2.0//en",
		         "-//o'reilly and associates//dtd html extended 1.0//en",
		         "-//spyglass//dtd html 2.0 extended//en",
		         "-//sq//dtd html 2.0 hotmetal + extensions//en",
		         "-//sun microsystems corp.//dtd hotjava html//en",
		         "-//sun microsystems corp.//dtd hotjava strict html//en",
		         "-//w3c//dtd html 3 1995-03-24//en",
		         "-//w3c//dtd html 3.2 draft//en",
		         "-//w3c//dtd html 3.2 final//en",
		         "-//w3c//dtd html 3.2//en",
		         "-//w3c//dtd html 3.2s draft//en",
		         "-//w3c//dtd html 4.0 frameset//en",
		         "-//w3c//dtd html 4.0 transitional//en",
		         "-//w3c//dtd html experimental 19960712//en",
		         "-//w3c//dtd html experimental 970421//en",
		         "-//w3c//dtd w3 html//en",
		         "-//w3o//dtd w3 html 3.0//en",
		         "-//w3o//dtd w3 html 3.0//en//",
		         "-//w3o//dtd w3 html strict 3.0//en//",
		         "-//webtechs//dtd mozilla html 2.0//en",
		         "-//webtechs//dtd mozilla html//en",
		         "-/w3c/dtd html 4.0 transitional/en",
		         "html"].indexOf(publicId) != -1) ||
		       (systemId == null && ["-//w3c//dtd html 4.01 frameset//EN",
			                     "-//w3c//dtd html 4.01 transitional//EN"].indexOf(publicId) != -1) ||
		       (systemId == 
		        "http://www.ibm.com/data/dtd/v11/ibmxhtml1-transitional.dtd")) {
		        // XXX quirks mode
		    }
	        }

	        this.parser.newPhase('beforeHTML');
            },

            processSpaceCharacters : function(data) {
            },

            processCharacters : function(data) {
	        this.parse_error('expected-doctype-but-got-chars');
	        this.parser.newPhase('beforeHTML');
	        this.parser.phase.processCharacters(data);
            },

            processStartTag : function(name, attributes, self_closing) {
	        this.parse_error('expected-doctype-but-got-start-tag', {name: name});
	        this.parser.newPhase('beforeHTML');
	        this.parser.phase.processStartTag(name, attributes);
            },

            processEndTag : function(name) {
	        this.parse_error('expected-doctype-but-got-end-tag', {name: name});
	        this.parser.newPhase('beforeHTML');
	        this.parser.phase.processEndTag(name);
            },
        },

        beforeHTML: {
            processEOF : function() {
	        this.insert_html_element();
	        this.parser.phase.processEOF();
            },

            processComment : function(data) {
	        this.tree.insert_comment(data, this.tree.document);
            },

            processSpaceCharacters : function(data) {
            },

            processCharacters : function(data) {
	        this.insert_html_element();
	        this.parser.phase.processCharacters(data);
            },

            processStartTag : function(name, attributes, self_closing) {
	        if(name == 'html') this.parser.first_start_tag = true;
	        this.insert_html_element();
	        this.parser.phase.processStartTag(name, attributes);
            },

            processEndTag : function(name) {
	        this.insert_html_element();
	        this.parser.phase.processEndTag(name);
            },

            insert_html_element : function() {
	        var element = this.tree.createElement('html', []);
	        this.tree.open_elements.push(element);
                appendNode(this.tree.document, element);
	        this.parser.newPhase('beforeHead');
            },
        },

        beforeHead: {

            start_tag_handlers: {
	        html: 'startTagHtml',
	        head: 'startTagHead',
	        '-default': 'startTagOther',
            },

            end_tag_handlers: {
	        html: 'endTagImplyHead',
	        head: 'endTagImplyHead',
	        body: 'endTagImplyHead',
	        br: 'endTagImplyHead',
	        p: 'endTagImplyHead',
	        '-default': 'endTagOther',
            },

            processEOF : function() {
	        this.startTagHead('head', {});
	        this.parser.phase.processEOF();
            },

            processCharacters : function(data) {
	        this.startTagHead('head', []);
	        this.parser.phase.processCharacters(data);
            },

            processSpaceCharacters : function(data) {
            },

            startTagHead : function(name, attributes) {
	        this.tree.insert_element(name, attributes);
	        this.tree.head_pointer = this.tree.open_elements.last();
	        this.parser.newPhase('inHead');
            },

            startTagOther : function(name, attributes) {
	        this.startTagHead('head', []);
	        this.parser.phase.processStartTag(name, attributes);
            },

            endTagImplyHead : function(name) {
	        this.startTagHead('head', []);
	        this.parser.phase.processEndTag(name);
            },

            endTagOther : function(name) {
	        this.parse_error('end-tag-after-implied-root', {name: name});
            },
        },
        inHead: {
            start_tag_handlers: {
	        html: 'startTagHtml',
	        head: 'startTagHead',
	        title: 'startTagTitle',
	        type: 'startTagType',
	        style: 'startTagStyle',
	        script: 'startTagScript',
	        noscript: 'startTagNoScript',
	        base: 'startTagBaseLinkMeta',
	        link: 'startTagBaseLinkMeta',
	        meta: 'startTagBaseLinkMeta',
	        "-default": 'startTagOther',
            },

            end_tag_handlers: {
	        head: 'endTagHead',
	        html: 'endTagImplyAfterHead',
	        body: 'endTagImplyAfterHead',
	        p: 'endTagImplyAfterHead',
	        br: 'endTagImplyAfterHead',
	        title: 'endTagTitleStyleScriptNoscript',
	        style: 'endTagTitleStyleScriptNoscript',
	        script: 'endTagTitleStyleScriptNoscript',
	        noscript: 'endTagTitleStyleScriptNoscript',
	        "-default": 'endTagOther',
            },


            processEOF : function() {
	        var name = this.tree.open_elements.last().tagname.toLowerCase()
	        if(['title', 'style', 'script'].indexOf(name) != -1) {
		    this.parse_error("expected-named-closing-tag-but-got-eof", {name: name});
		    this.tree.pop_element();
	        }

	        this.anything_else();

	        this.parser.phase.processEOF();
            },

            processCharacters : function(data) {
	        var name = this.tree.open_elements.last().tagname.toLowerCase()
	        if(['title', 'style', 'script', 'noscript'].indexOf(name) != -1) {
		    this.tree.insert_text(data);
	        } else {
		    this.anything_else();
		    this.parser.phase.processCharacters(data);
	        }
            },

            startTagHead : function(name, attributes) {
	        this.parse_error('two-heads-are-not-better-than-one');
            },

            startTagTitle : function(name, attributes) {
	        var element = this.tree.createElement(name, attributes);
	        this.appendToHead(element);
	        this.tree.open_elements.push(element);
	        this.parser.tokenizer.content_model = Models.RCDATA;
            },

            startTagStyle : function(name, attributes) {
	        if(this.tree.head_pointer && this.parser.phaseName == 'inHead') {
		    var element = this.tree.createElement(name, attributes);
		    this.appendToHead(element);
		    this.tree.open_elements.push(element);
	        } else {
		    this.tree.insert_element(name, attributes);
	        }
	        this.parser.tokenizer.content_model = Models.CDATA;
            },

            startTagNoScript : function(name, attributes) {
	        // XXX Need to decide whether to implement the scripting disabled case
	        var element = this.tree.createElement(name, attributes);
	        if(this.tree.head_pointer && this.parser.phaseName == 'inHead') {
		    this.appendToHead(element);
	        } else {
		    appendNode(this.tree.open_elements.last(), element);
	        }
	        this.tree.open_elements.push(element);
	        this.parser.tokenizer.content_model = Models.CDATA;
            },

            startTagScript : function(name, attributes) {
	        // XXX Inner HTML case may be wrong
	        var element = this.tree.createElement(name, attributes);
	        //element.flags.push('parser-inserted');
	        if(this.tree.head_pointer && this.parser.phaseName == 'inHead') {
		    this.appendToHead(element);
	        } else {
		    appendNode(this.tree.open_elements.last(),element);
	        }
	        this.tree.open_elements.push(element);
	        this.parser.tokenizer.content_model = Models.CDATA;
            },

            startTagBaseLinkMeta : function(name, attributes) {
	        var element = this.tree.createElement(name, attributes);
	        if(this.tree.head_pointer && this.parser.phaseName == 'inHead') {
		    this.appendToHead(element);
	        } else {
                    appendNode(this.tree.open_elements.last(), element);
	        }
            },

            startTagOther : function(name, attributes) {
	        this.anything_else();
	        this.parser.phase.processStartTag(name, attributes);
            },

            endTagHead : function(name) {
	        if(this.tree.open_elements[this.tree.open_elements.length - 1].tagname.toLowerCase() == 'head') {
		    this.tree.pop_element()
	        } else {
		    this.parse_error('unexpected-end-tag', {name: 'head'});
	        }
	        this.parser.newPhase('afterHead');
            },

            endTagImplyAfterHead : function(name) {
	        this.anything_else();
	        this.parser.phase.processEndTag(name);
            },

            endTagTitleStyleScriptNoscript : function(name) {
	        if(this.tree.open_elements[this.tree.open_elements.length - 1].tagname.toLowerCase() == name.toLowerCase()) {
		    this.tree.pop_element()
	        } else {
		    this.parse_error('unexpected-end-tag', {name: name});
	        }
            },

            endTagOther : function(name) {
	        this.anything_else();
            },

            anything_else : function() {
	        if(this.tree.open_elements.last().tagname.toLowerCase() == 'head') {
		    this.endTagHead('head')
	        } else {
		    this.parser.newPhase('afterHead');
	        }
            },

            // protected

            appendToHead : function(element) {
	        if(!this.tree.head_pointer) {
		    // FIXME assert(this.parser.inner_html)
		    appendNode(this.tree.open_elements.last(),element);
	        } else {
		    appendNode(this.tree.head_pointer,element);
	        }
            },

        },
        afterHead: {
            start_tag_handlers: {
	        html: 'startTagHtml',
	        body: 'startTagBody',
	        frameset: 'startTagFrameset',
	        base: 'startTagFromHead',
	        link: 'startTagFromHead',
	        meta: 'startTagFromHead',
	        script: 'startTagFromHead',
	        style: 'startTagFromHead',
	        title: 'startTagFromHead',
	        "-default": 'startTagOther',
            },

            end_tag_handlers: {
	        body: 'endTagBodyHtmlBr',
	        html: 'endTagBodyHtmlBr',
	        br: 'endTagBodyHtmlBr',
	        "-default": 'endTagOther',
            },

            processEOF : function() {
	        this.anything_else();
	        this.parser.phase.processEOF();
            },

            processCharacters : function(data) {
	        this.anything_else();
	        this.parser.phase.processCharacters(data);
            },

            startTagBody : function(name, attributes) {
	        this.tree.insert_element(name, attributes);
	        this.parser.newPhase('inBody');
            },

            startTagFrameset : function(name, attributes) {
	        this.tree.insert_element(name, attributes);
	        this.parser.newPhase('inFrameset');
            },

            startTagFromHead : function(name, attributes) {
	        this.parse_error("unexpected-start-tag-out-of-my-head", {name: name});
	        this.parser.newPhase('inHead');
	        this.parser.phase.processStartTag(name, attributes);
            },

            startTagOther : function(name, attributes) {
	        this.anything_else();
	        this.parser.phase.processStartTag(name, attributes);
            },

            endTagBodyHtmlBr : function(name) {
	        this.anything_else();
	        this.parser.phase.processEndTag(name);
            },

            endTagOther : function(name) {
	        this.parse_error('unexpected-end-tag', {name: name});
            },

            anything_else : function() {
	        this.tree.insert_element('body', []);
	        this.parser.newPhase('inBody');
            },

            processEndTag : function(name) {
	        this.anything_else()
	        this.parser.phase.processEndTag(name)
            },

        },
        inBody: {
            start_tag_handlers: {
	        html: 'startTagHtml',
	        head: 'startTagHead',
	        base: 'startTagProcessInHead',
	        link: 'startTagProcessInHead',
	        meta: 'startTagProcessInHead',
	        script: 'startTagProcessInHead',
	        style: 'startTagProcessInHead',
	        title: 'startTagProcessInHead',
	        body: 'startTagBody',
	        form: 'startTagForm',
	        plaintext: 'startTagPlaintext',
	        a: 'startTagA',
	        button: 'startTagButton',
	        xmp: 'startTagXmp',
	        table: 'startTagTable',
	        hr: 'startTagHr',
	        image: 'startTagImage',
	        input: 'startTagInput',
	        textarea: 'startTagTextarea',
	        select: 'startTagSelect',
	        isindex: 'startTagIsindex',
	        applet:	'startTagAppletMarqueeObject',
	        marquee:	'startTagAppletMarqueeObject',
	        object:	'startTagAppletMarqueeObject',
	        li: 'startTagListItem',
	        dd: 'startTagListItem',
	        dt: 'startTagListItem',
	        address: 'startTagCloseP',
	        blockquote: 'startTagCloseP',
	        center: 'startTagCloseP',
	        dir: 'startTagCloseP',
	        div: 'startTagCloseP',
	        dl: 'startTagCloseP',
	        fieldset: 'startTagCloseP',
	        listing: 'startTagCloseP',
	        menu: 'startTagCloseP',
	        ol: 'startTagCloseP',
	        p: 'startTagCloseP',
	        pre: 'startTagCloseP',
	        ul: 'startTagCloseP',
	        b: 'startTagFormatting',
	        big: 'startTagFormatting',
	        em: 'startTagFormatting',
	        font: 'startTagFormatting',
	        i: 'startTagFormatting',
	        s: 'startTagFormatting',
	        small: 'startTagFormatting',
	        strike: 'startTagFormatting',
	        strong: 'startTagFormatting',
	        tt: 'startTagFormatting',
	        u: 'startTagFormatting',
	        nobr: 'startTagNobr',
	        area: 'startTagVoidFormatting',
	        basefont: 'startTagVoidFormatting',
	        bgsound: 'startTagVoidFormatting',
	        br: 'startTagVoidFormatting',
	        embed: 'startTagVoidFormatting',
	        img: 'startTagVoidFormatting',
	        param: 'startTagVoidFormatting',
	        spacer: 'startTagVoidFormatting',
	        wbr: 'startTagVoidFormatting',
	        iframe: 'startTagCdata',
	        noembed: 'startTagCdata',
	        noframes: 'startTagCdata',
	        noscript: 'startTagCdata',
	        h1: 'startTagHeading',
	        h2: 'startTagHeading',
	        h3: 'startTagHeading',
	        h4: 'startTagHeading',
	        h5: 'startTagHeading',
	        h6: 'startTagHeading',
	        caption: 'startTagMisplaced',
	        col: 'startTagMisplaced',
	        colgroup: 'startTagMisplaced',
	        frame: 'startTagMisplaced',
	        frameset: 'startTagMisplaced',
	        head: 'startTagMisplaced',
	        tbody: 'startTagMisplaced',
	        td: 'startTagMisplaced',
	        tfoot: 'startTagMisplaced',
	        th: 'startTagMisplaced',
	        thead: 'startTagMisplaced',
	        tr: 'startTagMisplaced',
	        option: 'startTagMisplaced',
	        optgroup: 'startTagMisplaced',
	        'event-source': 'startTagNew',
	        section: 'startTagNew',
	        nav: 'startTagNew',
	        article: 'startTagNew',
	        aside: 'startTagNew',
	        header: 'startTagNew',
	        footer: 'startTagNew',
	        datagrid: 'startTagNew',
	        command: 'startTagNew',
	        math: 'startTagMath',
	        svg: 'startTagSVG',
	        "-default": 'startTagOther',
            },

            end_tag_handlers: {
	        p: 'endTagP',
	        body: 'endTagBody',
	        html: 'endTagHtml',
	        form: 'endTagForm',
	        applet: 'endTagAppletButtonMarqueeObject',
	        button: 'endTagAppletButtonMarqueeObject',
	        marquee: 'endTagAppletButtonMarqueeObject',
	        object: 'endTagAppletButtonMarqueeObject',
	        dd: 'endTagListItem',
	        dt: 'endTagListItem',
	        li: 'endTagListItem',
	        address: 'endTagBlock',
	        blockquote: 'endTagBlock',
	        center: 'endTagBlock',
	        div: 'endTagBlock',
	        dl: 'endTagBlock',
	        fieldset: 'endTagBlock',
	        listing: 'endTagBlock',
	        menu: 'endTagBlock',
	        ol: 'endTagBlock',
	        pre: 'endTagBlock',
	        ul: 'endTagBlock',
	        h1: 'endTagHeading',
	        h2: 'endTagHeading',
	        h3: 'endTagHeading',
	        h4: 'endTagHeading',
	        h5: 'endTagHeading',
	        h6: 'endTagHeading',
	        a: 'endTagFormatting',
	        b: 'endTagFormatting',
	        big: 'endTagFormatting',
	        em: 'endTagFormatting',
	        font: 'endTagFormatting',
	        i: 'endTagFormatting',
	        nobr: 'endTagFormatting',
	        s: 'endTagFormatting',
	        small: 'endTagFormatting',
	        strike: 'endTagFormatting',
	        strong: 'endTagFormatting',
	        tt: 'endTagFormatting',
	        u: 'endTagFormatting',
	        head: 'endTagMisplaced',
	        frameset: 'endTagMisplaced',
	        select: 'endTagMisplaced',
	        optgroup: 'endTagMisplaced',
	        option: 'endTagMisplaced',
	        table: 'endTagMisplaced',
	        caption: 'endTagMisplaced',
	        colgroup: 'endTagMisplaced',
	        col: 'endTagMisplaced',
	        thead: 'endTagMisplaced',
	        tfoot: 'endTagMisplaced',
	        tbody: 'endTagMisplaced',
	        tr: 'endTagMisplaced',
	        td: 'endTagMisplaced',
	        th: 'endTagMisplaced',
	        br: 'endTagBr',
	        area: 'endTagNone',
	        basefont: 'endTagNone',
	        bgsound: 'endTagNone',
	        embed: 'endTagNone',
	        hr: 'endTagNone',
	        image: 'endTagNone',
	        img: 'endTagNone',
	        input: 'endTagNone',
	        isindex: 'endTagNone',
	        param: 'endTagNone',
	        spacer: 'endTagNone',
	        wbr: 'endTagNone',
	        frame: 'endTagNone',
	        noframes:	'endTagCdataTextAreaXmp',
	        noscript:	'endTagCdataTextAreaXmp',
	        noembed:	'endTagCdataTextAreaXmp',
	        textarea:	'endTagCdataTextAreaXmp',
	        xmp:	'endTagCdataTextAreaXmp',
	        iframe:	'endTagCdataTextAreaXmp',
	        'event-source': 'endTagNew',
	        section: 'endTagNew',
	        nav: 'endTagNew',
	        article: 'endTagNew',
	        aside: 'endTagNew',
	        header: 'endTagNew',
	        footer: 'endTagNew',
	        datagrid: 'endTagNew',
	        command: 'endTagNew',
	        "-default": 'endTagOther',
            },

            processSpaceCharactersDropNewline : function(data) {
	        this.dropNewline = false
	        var lastTag = this.tree.open_elements.last().tagname.toLowerCase()
	        if(data.length > 0 && data[0] == "\n" && ('pre' == lastTag || 'textarea' == lastTag) && !hasChildNodes(this.tree.open_elements.last())) {
		    data = data.slice(1)
	        }

	        if(data.length > 0) {
		    this.tree.reconstructActiveFormattingElements()
		    this.tree.insert_text(data)
	        }
            },

            processSpaceCharacters : function(data) {
	        if(this.dropNewline) {
		    this.processSpaceCharactersDropNewline(data)
	        } else {
		    this.processSpaceCharactersNonPre(data)
	        }
            },

            processSpaceCharactersNonPre : function(data) {
	        this.tree.reconstructActiveFormattingElements();
	        this.tree.insert_text(data);
            },

            processCharacters : function(data) {
	        // XXX The specification says to do this for every character at the moment,
	        // but apparently that doesn't match the real world so we don't do it for
	        // space characters.
	        this.tree.reconstructActiveFormattingElements();
	        this.tree.insert_text(data);
            },

            startTagProcessInHead : function(name, attributes) {
	        new PHASES.inHead(this.parser, this.tree).processStartTag(name, attributes);
            },

            startTagBody : function(name, attributes) {
	        this.parse_error('unexpected-start-tag', {name: 'body'});
	        if(this.tree.open_elements.length == 1 
	           || this.tree.open_elements[1].tagname.toLowerCase() != 'body') {
		    /* assert.ok(this.parser.inner_html) */
	        } else {
                    var body = this.tree.open_elements[1];
		    for(var i = 0; i < attributes.length; i++) {
                        var alreadyhas = body.attributes.some(function(a) {
                            return a.nodeName == attributes[i].nodeName;
                        });
                        if (!alreadyhas) {
                            body.attributes.push(attributes[i]);
                        }
		    }
	        }
            },

            startTagCloseP : function(name, attributes) {
	        if(this.inScope('p')) this.endTagP('p');
	        this.tree.insert_element(name, attributes);
	        if(name == 'pre') {
		    this.dropNewline = true
	        }
            },

            startTagForm : function(name, attributes) {
	        if(this.tree.formPointer) {
		    this.parse_error('unexpected-start-tag', {name: name});
	        } else {
		    if(this.inScope('p')) this.endTagP('p');
		    this.tree.insert_element(name, attributes);
		    this.tree.formPointer = this.tree.open_elements.last();
	        }
            },

            startTagListItem : function(name, attributes) {
	        if(this.inScope('p')) this.endTagP('p');
	        var stopNames = {li: ['li'], dd: ['dd', 'dt'], dt: ['dd', 'dt']};
	        var stopName = stopNames[name];

	        var els = this.tree.open_elements;
	        for(var i = els.length - 1; i >= 0; i--) {
		    var node = els[i];
		    if(stopName.indexOf(node.tagname.toLowerCase()) != -1) {
		        var poppedNodes = [];
		        while(els.length - 1 >= i) {
			    poppedNodes.push(els.pop());
		        }
		        if(poppedNodes.length >= 1) {
			    this.parse_error(poppedNodes.length == 1 ? "missing-end-tag" : "missing-end-tags",
					     {name: poppedNodes.slice(0).map(function (n) { return n.name }).join(', ')});
		        }
		        break;
		    }

		    // Phrasing eliments are all non special, non scoping, non
		    // formatting elements
		    if(SPECIAL_ELEMENTS.concat(SCOPING_ELEMENTS).indexOf(node.tagname.toLowerCase()) != -1 && (node.tagname.toLowerCase() != 'address' && node.tagname.toLowerCase() != 'div')) break;
	        }

	        // Always insert an <li> element
	        this.tree.insert_element(name, attributes);
            },

            startTagPlaintext : function(name, attributes) {
	        if(this.inScope('p')) this.endTagP('p');
	        this.tree.insert_element(name, attributes);
	        this.parser.tokenizer.content_model = Models.PLAINTEXT;
            },

            startTagHeading : function(name, attributes) {
	        if(this.inScope('p')) this.endTagP('p');
	        this.tree.insert_element(name, attributes);
            },

            startTagA : function(name, attributes) {
	        var afeAElement;
	        if(afeAElement = this.tree.elementInActiveFormattingElements('a')) {
		    this.parse_error("unexpected-start-tag-implies-end-tag", {startName: "a", endName: "a"});
		    this.endTagFormatting('a');
		    var pos;
		    pos = this.tree.open_elements.indexOf(afeAElement);
		    if(pos != -1) this.tree.open_elements.splice(pos, 1);
		    pos = this.tree.activeFormattingElements.indexOf(afeAElement);
		    if(pos != -1) this.tree.activeFormattingElements.splice(pos, 1);
	        }
	        this.tree.reconstructActiveFormattingElements();
	        this.addFormattingElement(name, attributes);
            },

            startTagFormatting : function(name, attributes) {
	        this.tree.reconstructActiveFormattingElements();
	        this.addFormattingElement(name, attributes);
            },

            startTagNobr : function(name, attributes) {
	        this.tree.reconstructActiveFormattingElements();
	        if(this.inScope('nobr')) {
		    this.parse_error("unexpected-start-tag-implies-end-tag", {startName: 'nobr', endName: 'nobr'});
		    this.processEndTag('nobr');
	        }
	        this.addFormattingElement(name, attributes);
            },

            startTagButton : function(name, attributes) {
	        if(this.inScope('button')) {
		    this.parse_error('unexpected-start-tag-implies-end-tag', {startName: 'button', endName: 'button'});
		    this.processEndTag('button');
		    this.parser.phase.processStartTag(name, attributes);
	        } else {
		    this.tree.reconstructActiveFormattingElements();
		    this.tree.insert_element(name, attributes);
		    this.tree.activeFormattingElements.push(Marker);
	        }
            },

            startTagAppletMarqueeObject : function(name, attributes) {
	        this.tree.reconstructActiveFormattingElements();
	        this.tree.insert_element(name, attributes)
	        this.tree.activeFormattingElements.push(Marker);
            },

            endTagAppletButtonMarqueeObject : function(name) {
	        if(this.inScope(name)) this.tree.generateImpliedEndTags()
	        if(this.tree.open_elements.last().tagname.toLowerCase() != name) {
		    this.parse_error('end-tag-too-early', {name: name})
	        }
	        if(this.inScope(name)) {
		    this.tree.remove_open_elements_until(name)
		    this.tree.clearActiveFormattingElements()
	        }
            },

            startTagXmp : function(name, attributes) {
	        this.tree.reconstructActiveFormattingElements();
	        this.tree.insert_element(name, attributes);
	        this.parser.tokenizer.content_model = Models.CDATA;
            },

            startTagTable : function(name, attributes) {
	        if(this.inScope('p')) this.processEndTag('p');
	        this.tree.insert_element(name, attributes);
	        this.parser.newPhase('inTable');
            },

            startTagVoidFormatting : function(name, attributes) {
	        this.tree.reconstructActiveFormattingElements();
	        this.tree.insert_element(name, attributes);
	        this.tree.pop_element();
            },

            startTagHr : function(name, attributes) {
	        if(this.inScope('p')) this.endTagP('p');
	        this.tree.insert_element(name, attributes);
	        this.tree.pop_element();
            },

            startTagImage : function(name, attributes) {
	        // No, really...
	        this.parse_error('unexpected-start-tag-treated-as', {originalName: 'image', newName: 'img'});
	        this.processStartTag('img', attributes);
            },

            startTagInput : function(name, attributes) {
	        this.tree.reconstructActiveFormattingElements();
	        this.tree.insert_element(name, attributes);
	        if(this.tree.formPointer) {
		    // XXX Not sure what to do here
	        }
	        this.tree.pop_element();
            },

            startTagIsindex : function(name, attributes) {
	        this.parse_error('deprecated-tag', {name: 'isindex'});
	        if(this.tree.formPointer) return;
	        this.processStartTag('form');
	        this.processStartTag('hr');
	        this.processStartTag('p');
	        this.processStartTag('label');
	        this.processCharacters("This is a searchable index. Insert your search keywords here: ");
	        attributes.push({nodeName: 'name', nodeValue: 'isindex'})
	        this.processStartTag('input', attributes);
	        this.processEndTag('label');
	        this.processEndTag('p');
	        this.processStartTag('hr');
	        this.processEndTag('form');
            },

            startTagTextarea : function(name, attributes) {
	        // XXX Form element pointer checking here as well...
	        this.tree.insert_element(name, attributes)
	        this.parser.tokenizer.content_model = Models.RCDATA;
	        this.dropNewline = true
            },

            startTagCdata : function(name, attributes) {
	        this.tree.insert_element(name, attributes)
	        this.parser.tokenizer.content_model = Models.CDATA;
            },

            startTagSelect : function(name, attributes) {
	        this.tree.reconstructActiveFormattingElements();
	        this.tree.insert_element(name, attributes);
	        
	        var phaseName = this.parser.phaseName;
	        if(phaseName == 'inTable' || phaseName == 'inCaption'
	           || phaseName == 'inColumnGroup'
	           || phaseName == 'inTableBody'
	           || phaseName == 'inRow'
	           || phaseName == 'inCell') {
		    this.parser.newPhase('inSelectInTable');
	        } else {
		    this.parser.newPhase('inSelect');
	        }
            },

            startTagMisplaced : function(name, attributes) {
	        this.parse_error('unexpected-start-tag-ignored', {name: name});
            },

            endTagMisplaced : function(name) {
	        // This handles elements with end tags in other insertion modes.
	        this.parse_error("unexpected-end-tag", {name: name})
            },

            endTagBr : function(name) {
	        this.parse_error("unexpected-end-tag-treated-as", {originalName: "br", newName: "br element"})
	        this.tree.reconstructActiveFormattingElements()
	        this.tree.insert_element(name, [])
	        this.tree.pop_element()

            },

            startTagOptionOptgroup : function(name, attributes) {
	        if(this.inScope('option')) endTagOther('option');
	        this.tree.reconstructActiveFormattingElements();
	        this.tree.insert_element(name, attributes);
            },

            startTagNew : function(name, attributes) {	
	        this.startTagOther(name, attributes);
            },

            startTagOther : function(name, attributes) {
	        this.tree.reconstructActiveFormattingElements();
	        this.tree.insert_element(name, attributes);
            },

            endTagOther : function endTagOther(name) {
	        var nodes = this.tree.open_elements;
	        for(var eli = nodes.length - 1; eli > 0; eli--) {
		    var currentNode = nodes[eli];
		    if(nodes[eli].tagname.toLowerCase() == name) {
		        this.tree.generateImpliedEndTags();
		        if(this.tree.open_elements.last().tagname.toLowerCase() != name) {
			    this.parse_error('unexpected-end-tag', {name: name});
		        }
		        
		        this.tree.remove_open_elements_until(function(el) {
			    return el == currentNode;
		        });

		        break;
		    } else {

		        if(SPECIAL_ELEMENTS.concat(SCOPING_ELEMENTS).indexOf(nodes[eli].tagname.toLowerCase()) != -1) {
			    this.parse_error('unexpected-end-tag', {name: name});   
			    break;
		        }
		    }
	        }
            },

            startTagMath : function(name, attributes) {
	        this.tree.reconstructActiveFormattingElements();
	        attributes = this.adjust_mathml_attributes(attributes);
	        attributes = this.adjust_foreign_attributes(attributes);
	        this.tree.insert_foreign_element(name, attributes, 'math');
	        if(false) {
		    // If the token has its self-closing flag set, pop the current node off
		    // the stack of open elements and acknowledge the token's self-closing flag
	        } else {
		    this.parser.secondary_phase = this.parser.phase;
		    this.parser.newPhase('inForeignContent');
	        }
            },

            startTagSVG : function(name, attributes) {
	        this.tree.reconstructActiveFormattingElements();
	        attributes = this.adjust_svg_attributes(attributes);
	        attributes = this.adjust_foreign_attributes(attributes);
	        this.tree.insert_foreign_element(name, attributes, 'svg');
	        if(false) {
		    // If the token has its self-closing flag set, pop the current node off
		    // the stack of open elements and acknowledge the token's self-closing flag
	        } else {
		    this.parser.secondary_phase = this.parser.phase;
		    this.parser.newPhase('inForeignContent');
	        }
            },

            endTagP : function(name) {
	        if(this.inScope('p')) this.tree.generateImpliedEndTags('p');
	        if(!this.tree.open_elements.last().tagname.toLowerCase() == 'p')
		    this.parse_error('unexpected-end-tag', {name: 'p'});
	        if(this.inScope('p')) {
		    while(this.inScope('p')) this.tree.pop_element();
	        } else {
		    this.startTagCloseP('p', []);
		    this.endTagP('p');
	        }
            },

            endTagBody : function(name) {
	        if(this.tree.open_elements[1].tagname.toLowerCase() != 'body') {
		    // inner_html case
		    this.parse_error('unexpected-end-tag', {name: 'body'});
		    return;
	        }

	        if(this.tree.open_elements.last().tagname.toLowerCase() != 'body') {
		    this.parse_error('expected-one-end-tag-but-got-another', {
		        expectedName: 'body',
		        gotName: this.tree.open_elements.last().tagname.toLowerCase()
		    });
	        }
	        this.parser.newPhase('afterBody');
            },

            endTagHtml : function(name) {
	        this.endTagBody(name);
	        if(!this.inner_html) this.parser.phase.processEndTag(name);
            },

            endTagBlock : function(name) {
	        if(this.inScope(name)) this.tree.generateImpliedEndTags();
	        if(!this.tree.open_elements.last().tagname.toLowerCase() == 'name') {
		    this.parse_error('end-tag-too-early', {name: name});
	        }
	        if(this.inScope(name)) this.tree.remove_open_elements_until(name);
            },

            endTagForm : function(name)  {
	        if(this.inScope(name)) {
		    this.tree.generateImpliedEndTags();
	        }
	        
	        if(this.tree.open_elements.last().tagname.toLowerCase() != name) {
		    this.parse_error('end-tag-too-early-ignored', {name: 'form'});
	        } else {
		    this.tree.pop_element();
	        }
	        this.tree.formPointer = null;
            },

            endTagListItem : function(name) {
	        if(this.inScope(name)) this.tree.generateImpliedEndTags(name);
	        if(this.tree.open_elements.last().tagname.toLowerCase() != name)
		    this.parse_error('end-tag-too-early', {name: name});
	        if(this.inScope(name)) this.tree.remove_open_elements_until(name);
            },

            endTagHeading : function(name) {
	        for(i in HEADING_ELEMENTS) {
		    var el = HEADING_ELEMENTS[i];
		    if(this.inScope(el)) {
		        this.tree.generateImpliedEndTags();
		        break;
		    }
	        }

	        if(this.tree.open_elements.last().tagname.toLowerCase() != name)
		    this.parse_error('end-tag-too-early', {name: name});

	        for(i in HEADING_ELEMENTS) {
		    var el = HEADING_ELEMENTS[i];
		    if(this.inScope(el)) {
		        this.tree.remove_open_elements_until(function(e) {
			    return HEADING_ELEMENTS.indexOf(e.tagname.toLowerCase()) != -1
		        });
		        break;
		    }
	        }
            },

            endTagFormatting : function(name) {
	        while(true) {
		    var afeElement = this.tree.elementInActiveFormattingElements(name);
		    if(!afeElement || (this.tree.open_elements.indexOf(afeElement) != -1
			               && !this.inScope(afeElement.tagname.toLowerCase()))) {
		        this.parse_error('adoption-agency-1.1', {name: name});
		        return;
		    } else if(this.tree.open_elements.indexOf(afeElement) == -1) {
		        this.parse_error('adoption-agency-1.2', {name: name});
		        this.tree.activeFormattingElements.splice(this.tree.activeFormattingElements.indexOf(afeElement), 1);
		        return;
		    }

		    if(afeElement != this.tree.open_elements.last()) {
		        this.parse_error('adoption-agency-1.3', {name: name});
		    }
		    
		    // Start of the adoption agency algorithm proper
		    var afeIndex = this.tree.open_elements.indexOf(afeElement);
		    var furthestBlock = null;
		    var els = this.tree.open_elements.slice(afeIndex);
                    var len = els.length;
                    for(var i = 0; i < len; i++) {
		        var element = els[i];
		        if(SPECIAL_ELEMENTS.concat(SCOPING_ELEMENTS).indexOf(element.tagname.toLowerCase()) != -1) {
			    furthestBlock = element;
			    break;
		        }
		    }
		    
		    if(!furthestBlock) {
		        var element = this.tree.remove_open_elements_until(function(el) {
			    return el == afeElement;
		        });
		        this.tree.activeFormattingElements.splice(this.tree.activeFormattingElements.indexOf(element), 1);
		        return;
		    }


		    var commonAncestor = this.tree.open_elements[afeIndex - 1];

		    var bookmark = this.tree.activeFormattingElements.indexOf(afeElement);

		    var lastNode;
		    var node;
		    lastNode = node = furthestBlock;

		    while(true) {
		        node = this.tree.open_elements[this.tree.open_elements.indexOf(node) - 1];
		        while(this.tree.activeFormattingElements.indexOf(node) == -1) {
			    var tmpNode = node;
			    node = this.tree.open_elements[this.tree.open_elements.indexOf(node) - 1];
			    this.tree.open_elements.splice(this.tree.open_elements.indexOf(tmpNode), 1);
		        }

		        if(node == afeElement) break;

		        if(lastNode == furthestBlock) {
			    bookmark = this.tree.activeFormattingElements.indexOf(node) + 1;
		        }

		        var cite = node.parent;

		        if(node.children && node.children.length) {
			    var clone = cloneNode(node);
			    this.tree.activeFormattingElements[this.tree.activeFormattingElements.indexOf(node)] = clone;
			    this.tree.open_elements[this.tree.open_elements.indexOf(node)] = clone;
			    node = clone;
		        }

                        removeNode(lastNode);
		        appendNode(node, lastNode);
		        lastNode = node

		    }

                    removeNode(lastNode);
		    appendNode(commonAncestor, lastNode);

		    clone = cloneNode(afeElement);

		    this.tree.reparentChildren(furthestBlock, clone);

		    appendNode(furthestBlock, clone);

		    this.tree.activeFormattingElements.splice(this.tree.activeFormattingElements.indexOf(afeElement), 1);
		    this.tree.activeFormattingElements.splice(Math.min(bookmark, this.tree.activeFormattingElements.length), 0, clone);

		    this.tree.open_elements.splice(this.tree.open_elements.indexOf(afeElement), 1);
		    this.tree.open_elements.splice(this.tree.open_elements.indexOf(furthestBlock) + 1, 0, clone);

	        }
            },

            addFormattingElement : function(name, attributes) {
	        this.tree.insert_element(name, attributes);
	        this.tree.activeFormattingElements.push(this.tree.open_elements.last());
            },

        },
        inTable: {
            start_tag_handlers: {
	        html: 'startTagHtml',
	        caption: 'startTagCaption',
	        colgroup: 'startTagColgroup',
	        col: 'startTagCol',
	        table: 'startTagTable',
	        tbody: 'startTagRowGroup',
	        tfoot: 'startTagRowGroup',
	        thead: 'startTagRowGroup',
	        td: 'startTagImplyTbody',
	        th: 'startTagImplyTbody',
	        tr: 'startTagImplyTbody',
	        '-default': 'startTagOther',
            },

            end_tag_handlers: {
	        table: 'endTagTable',
	        body: 'endTagIgnore',
	        caption: 'endTagIgnore',
	        col: 'endTagIgnore',
	        colgroup: 'endTagIgnore',
	        html: 'endTagIgnore',
	        tbody: 'endTagIgnore',
	        td: 'endTagIgnore',
	        tfoot: 'endTagIgnore',
	        th: 'endTagIgnore',
	        thead: 'endTagIgnore',
	        tr: 'endTagIgnore',
	        '-default': 'endTagOther',
            },

            processCharacters :  function(data) {
	        this.parse_error("unexpected-char-implies-table-voodoo");
	        this.tree.insert_from_table = true;
	        new PHASES.inBody(this.parser, this.tree).processCharacters(data);
	        this.tree.insert_from_table = false;
            },

            startTagCaption : function(name, attributes) {
	        this.clearStackToTableContext();
	        this.tree.activeFormattingElements.push(Marker);
	        this.tree.insert_element(name, attributes);
	        this.parser.newPhase('inCaption');
            },

            startTagColgroup : function(name, attributes) {
	        this.clearStackToTableContext();
	        this.tree.insert_element(name, attributes);
	        this.parser.newPhase('inColumnGroup');
            },

            startTagCol : function(name, attributes) {
	        this.startTagColgroup('colgroup', []);
	        this.parser.phase.processStartTag(name, attributes);
            },

            startTagRowGroup : function(name, attributes) {
	        this.clearStackToTableContext();
	        this.tree.insert_element(name, attributes);
	        this.parser.newPhase('inTableBody');
            },

            startTagImplyTbody : function(name, attributes) {
	        this.startTagRowGroup('tbody', []);
	        this.parser.phase.processStartTag(name, attributes);
            },

            startTagTable : function(name, attributes) {
	        this.parse_error("unexpected-start-tag-implies-end-tag",
                                 {startName: "table", endName: "table"});
	        this.parser.phase.processEndTag('table');
	        if(!this.parser.inner_html) this.parser.phase.processStartTag(name, attributes);
            },

            startTagOther : function(name, attributes) {
	        this.parse_error("unexpected-start-tag-implies-table-voodoo", {name: name});
	        this.tree.insert_from_table = true;
	        new PHASES.inBody(this.parser, this.tree).processStartTag(name, attributes);
	        this.tree.insert_from_table = false;
            },

            endTagTable : function(name) {
	        if(this.inScope(name, true)) {
		    this.tree.generateImpliedEndTags();
		    if(this.tree.open_elements.last().tagname.toLowerCase() != name) {
		        this.parse_error("end-tag-too-early-named", {gotName: 'table', expectedName: this.tree.open_elements.last().tagname.toLowerCase()});
		    }

		    this.tree.remove_open_elements_until('table');
		    this.parser.reset_insertion_mode(this.tree.open_elements.last());
	        } else {
		    assert.ok(this.parser.inner_html);
		    this.parse_error();
	        }
            },

            endTagIgnore : function(name) {
	        this.parse_error("unexpected-end-tag", {name: name});
            },

            endTagOther : function(name) {
	        this.parse_error("unexpected-end-tag-implies-table-voodoo", {name: name})
	        // Make all the special element rearranging voodoo kick in
	        this.tree.insert_from_table = true
	        // Process the end tag in the "in body" mode
	        new PHASES.inBody(this.parser, this.tree).processEndTag(name)
	        this.tree.insert_from_table = false
            },

            clearStackToTableContext : function() {
	        var name;
	        while(name = this.tree.open_elements.last().tagname.toLowerCase(), (name != 'table' && name != 'html')) {
		    this.parse_error("unexpected-implied-end-tag-in-table", {name: name})
		    this.tree.pop_element()
	        }
	        // When the current node is <html> it's an inner_html case
            },

        },
        inCaption: {
            start_tag_handlers: {
	        html: 'startTagHtml',
	        caption: 'startTagTableElement',
	        col: 'startTagTableElement',
	        colgroup: 'startTagTableElement',
	        tbody: 'startTagTableElement',
	        td: 'startTagTableElement',
	        tfoot: 'startTagTableElement',
	        thead: 'startTagTableElement',
	        tr: 'startTagTableElement',
	        '-default': 'startTagOther'
            },

            end_tag_handlers: {
	        caption: 'endTagCaption',
	        table: 'endTagTable',
	        body: 'endTagIgnore',
	        col: 'endTagIgnore',
	        colgroup: 'endTagIgnore',
	        html: 'endTagIgnore',
	        tbody: 'endTagIgnore',
	        td: 'endTagIgnore',
	        tfood: 'endTagIgnore',
	        thead: 'endTagIgnore',
	        tr: 'endTagIgnore',
	        '-default': 'endTagOther'
            },

            ignoreEndTagCaption : function() {
	        return !this.inScope('caption', true);
            },

            processCharacters : function(data) {
	        new PHASES.inBody(this.parser, this.tree).processCharacters(data);
            },

            startTagTableElement : function(name, attributes) {
	        this.parse_error('unexpected-end-tag', {name: name});
	        var ignoreEndTag = this.ignoreEndTagCaption();
	        this.parser.phase.processEndTag('caption');
	        if(!ignoreEndTag) this.parser.phase.processStartTag(name, attributes)
            },

            startTagOther : function(name, attributes) {
	        new PHASES.inBody(this.parser, this.tree).processStartTag(name, attributes);
            },

            endTagCaption : function(name) {
	        if(this.ignoreEndTagCaption()) {
		    // inner_html case
		    assert.ok(this.parser.inner_html);
		    this.parse_error('unexpected-end-tag', {name: name});
	        } else {
		    // AT this code is quite similar to endTagTable in inTable
		    this.tree.generateImpliedEndTags();
		    if(this.tree.open_elements.last().tagname.toLowerCase() != 'caption') {
		        this.parse_error('expected-one-end-tag-but-got-another',
                    		         {gotName: "caption", expectedName: this.tree.open_elements.last().tagname.toLowerCase()});
		    }

		    this.tree.remove_open_elements_until('caption');
	            
		    this.tree.clearActiveFormattingElements();

		    this.parser.newPhase('inTable');
	        }
            },

            endTagTable : function(name) {
	        this.parse_error("unexpected-end-table-in-caption");
	        var ignoreEndTag = this.ignoreEndTagCaption();
	        this.parser.phase.processEndTag('caption')
	        if(!ignoreEndTag) this.parser.phase.processEndTag(name);
            },

            endTagIgnore : function(name) {
	        this.parse_error('unexpected-end-tag', {name: name});
            },

            endTagOther : function(name) {
	        new PHASES.inBody(this.parser, this.tree).processEndTag(name);
            },

        },
        inColumnGroup: {
            start_tag_handlers: {
	        html: 'startTagHtml',
	        col: 'startTagCol',
	        '-default': 'startTagOther',
            },

            end_tag_handlers: {
	        colgroup: 'endTagColgroup',
	        col: 'endTagCol',
	        '-default': 'endTagOther',
            },


            ignoreEndTagColgroup : function() {
	        return this.tree.open_elements.last().tagname.toLowerCase() == 'html'
            },

            processCharacters : function(data) {
	        var ignoreEndTag = this.ignoreEndTagColgroup()
	        this.endTagColgroup('colgroup')
	        if(!ignoreEndTag) this.parser.phase.processCharacters(data)
            },

            startTagCol : function(name, attributes) {
	        this.tree.insert_element(name, attributes)
	        this.tree.pop_element()
            },

            startTagOther : function(name, attributes) {
	        var ignoreEndTag = this.ignoreEndTagColgroup()
	        this.endTagColgroup('colgroup')
	        if(!ignoreEndTag) this.parser.phase.processStartTag(name, attributes)
            },

            endTagColgroup : function(name) {
	        if(this.ignoreEndTagColgroup()) {
		    // inner_html case
		    assert.ok(this.parser.inner_html)
		    this.parse_error()
	        } else {
		    this.tree.pop_element()
		    this.parser.newPhase('inTable')
	        }
            },

            endTagCol : function(name) {
	        this.parse_error("no-end-tag", {name: 'col'})
            },

            endTagOther : function(name) {
	        var ignoreEndTag = this.ignoreEndTagColgroup()
	        this.endTagColgroup('colgroup')
	        if(!ignoreEndTag) this.parser.phase.processEndTag(name) 
            },
        },
        inTableBody: {
            start_tag_handlers: {
	        html: 'startTagHtml',
	        tr: 'startTagTr',
	        td: 'startTagTableCell',
	        th: 'startTagTableCell',
	        caption: 'startTagTableOther',
	        col: 'startTagTableOther',
	        colgroup: 'startTagTableOther',
	        tbody: 'startTagTableOther',
	        tfoot: 'startTagTableOther',
	        thead: 'startTagTableOther',
	        '-default': 'startTagOther',
            },

            end_tag_handlers: {
	        table: 'endTagTable',
	        tbody: 'endTagTableRowGroup',
	        tfoot: 'endTagTableRowGroup',
	        thead: 'endTagTableRowGroup',
	        body: 'endTagIgnore',
	        caption: 'endTagIgnore',
	        col: 'endTagIgnore',
	        colgroup: 'endTagIgnore',
	        html: 'endTagIgnore',
	        td: 'endTagIgnore',
	        th: 'endTagIgnore',
	        tr: 'endTagIgnore',
	        '-default': 'endTagOther',
            },


            processCharacters : function(data) {
	        new PHASES.inTable(this.parser, this.tree).processCharacters(data);
            },

            startTagTr : function(name, attributes) {
	        this.clearStackToTableBodyContext();
	        this.tree.insert_element(name, attributes);
	        this.parser.newPhase('inRow');
            },

            startTagTableCell : function(name, attributes) {
	        this.parse_error("unexpected-cell-in-table-body", {name: name})
	        this.startTagTr('tr', [])
	        this.parser.phase.processStartTag(name, attributes);
            },

            startTagTableOther : function(name, attributes) {
	        // XXX any ideas on how to share this with endTagTable
	        if(this.inScope('tbody', true) ||  this.inScope('thead', true) || this.inScope('tfoot', true)) {
		    this.clearStackToTableBodyContext();
		    this.endTagTableRowGroup(this.tree.open_elements.last().tagname.toLowerCase());
		    this.parser.phase.processStartTag(name, attributes);
	        } else {
		    // inner_html case
		    this.parse_error
	        }
            },
	    
            startTagOther : function(name, attributes) {
	        new PHASES.inTable(this.parser, this.tree).processStartTag(name, attributes);
            },

            endTagTableRowGroup: function(name) {
	        if(this.inScope(name, true)) {
		    this.clearStackToTableBodyContext();
		    this.tree.pop_element();
		    this.parser.newPhase('inTable');
	        } else {
		    this.parse_error('unexpected-end-tag-in-table-body', {name: name})
	        }
            },

            endTagTable : function(name) {
	        if(this.inScope('tbody', true) || this.inScope('thead', true) || this.inScope('tfoot', true)) {
		    this.clearStackToTableBodyContext();
		    this.endTagTableRowGroup(this.tree.open_elements.last().tagname.toLowerCase())
		    this.parser.phase.processEndTag(name)
	        } else {
		    // inner_html case
		    this.parse_error();
	        }
            },

            endTagIgnore : function(name) {
	        this.parse_error("unexpected-end-tag-in-table-body", {name: name});
            },

            endTagOther : function(name) {
	        new PHASES.inTable(this.parser, this.tree).processEndTag(name);
            },

            clearStackToTableBodyContext : function() {
	        while(name = this.tree.open_elements.last().tagname.toLowerCase(), name != 'tbody' && name != 'tfoot' && name != 'thead' && name != 'html') {
		    this.parse_error("unexpected-implied-end-tag-in-table", {name: name})
		    this.tree.pop_element();
	        }
            },
        },
        inRow: {
            start_tag_handlers: {
	        html: 'startTagHtml',
	        td: 'startTagTableCell',
	        th: 'startTagTableCell',
	        caption: 'startTagTableOther',
	        col: 'startTagTableOther',
	        colgroup: 'startTagTableOther',
	        tbody: 'startTagTableOther',
	        tfoot: 'startTagTableOther',
	        thead: 'startTagTableOther',
	        tr: 'startTagTableOther',
	        '-default': 'startTagOther',
            },

            end_tag_handlers: {
	        tr: 'endTagTr',
	        table: 'endTagTable',
	        tbody: 'endTagTableRowGroup',
	        tfoot: 'endTagTableRowGroup',
	        thead: 'endTagTableRowGroup',
	        body: 'endTagIgnore',
	        caption: 'endTagIgnore',
	        col: 'endTagIgnore',
	        colgroup: 'endTagIgnore',
	        html: 'endTagIgnore',
	        td: 'endTagIgnore',
	        th: 'endTagIgnore',
	        '-default': 'endTagOther',
            },


            processCharacters : function(data) {
	        new PHASES.inTable(this.parser, this.tree).processCharacters(data);
            },

            startTagTableCell : function(name, attributes) {
	        this.clearStackToTableRowContext();
	        this.tree.insert_element(name, attributes);
	        this.parser.newPhase('inCell');
	        this.tree.activeFormattingElements.push(Marker);
            },

            startTagTableOther : function(name, attributes) {
	        var ignoreEndTag = this.ignoreEndTagTr();
	        this.endTagTr('tr');
	        // XXX how are we sure it's always ignored in the inner_html case?
	        if(!ignoreEndTag) this.parser.phase.processStartTag(name, attributes);
            },

            startTagOther : function(name, attributes) {
	        new PHASES.inTable(this.parser, this.tree).processStartTag(name, attributes);
            },

            endTagTr : function(name) {
	        if(this.ignoreEndTagTr()) {
		    assert.ok(this.parser.inner_html);
		    this.parse_error
	        } else {
		    this.clearStackToTableRowContext();
		    this.tree.pop_element();
		    this.parser.newPhase('inTableBody');
	        }
            },

            endTagTable : function(name) {
	        var ignoreEndTag = this.ignoreEndTagTr();
	        this.endTagTr('tr');
	        // Reprocess the current tag if the tr end tag was not ignored
	        // XXX how are we sure it's always ignored in the inner_html case?
	        if(!ignoreEndTag) this.parser.phase.processEndTag(name) 
            },

            endTagTableRowGroup : function(name) {
	        if(this.inScope(name, true)) {
		    this.endTagTr('tr');
		    this.parser.phase.processEndTag(name);
	        } else {
		    // inner_html case
		    this.parse_error();
	        }
            },

            endTagIgnore : function(name) {
	        this.parse_error("unexpected-end-tag-in-table-row", {name: name})
            },

            endTagOther : function(name) {
	        new PHASES.inTable(this.parser, this.tree).processEndTag(name);
            },

            clearStackToTableRowContext : function() {
	        var name;
	        while(name = this.tree.open_elements.last().tagname.toLowerCase(), (name != 'tr' && name != 'html')) {
		    this.parse_error("unexpected-implied-end-tag-in-table-row", {name: name})
		    this.tree.pop_element();
	        }
            },

            ignoreEndTagTr : function() {
	        return !this.inScope('tr', true);
            },
        },
        inCell: {
            start_tag_handlers: {
	        html: 'startTagHtml',
	        caption: 'startTagTableOther',
	        col: 'startTagTableOther',
	        colgroup: 'startTagTableOther',
	        tbody: 'startTagTableOther',
	        td: 'startTagTableOther',
	        tfoot: 'startTagTableOther',
	        th: 'startTagTableOther',
	        thead: 'startTagTableOther',
	        tr: 'startTagTableOther',
	        '-default': 'startTagOther',
            },

            end_tag_handlers: {
	        td: 'endTagTableCell',
	        th: 'endTagTableCell',
	        body: 'endTagIgnore',
	        caption: 'endTagIgnore',
	        col: 'endTagIgnore',
	        colgroup: 'endTagIgnore',
	        html: 'endTagIgnore',
	        table: 'endTagImply',
	        tbody: 'endTagImply',
	        tfoot: 'endTagImply',
	        thead: 'endTagImply',
	        tr: 'endTagImply',
	        '-default': 'endTagOther',
            },

            processCharacters : function(data) {
	        new PHASES.inBody(this.parser, this.tree).processCharacters(data);
            },

            startTagTableOther : function(name, attributes) {
	        if(this.inScope('td', true) || this.inScope('th', true)) {
		    this.closeCell();
		    this.parser.phase.processStartTag(name, attributes);
	        } else {
		    // inner_html case
		    this.parse_error();
	        }
            },

            startTagOther : function(name, attributes) {
	        new PHASES.inBody(this.parser, this.tree).processStartTag(name, attributes);
            },

            endTagTableCell : function(name) {
	        if(this.inScope(name, true)) {
		    this.tree.generateImpliedEndTags(name);
		    if(this.tree.open_elements.last().tagname.toLowerCase() != name.toLowerCase()) {
		        this.parse_error('unexpected-cell-end-tag', {name: name});
		        this.tree.remove_open_elements_until(name);
		    } else {
		        this.tree.pop_element();
		    }
		    this.tree.clearActiveFormattingElements();
		    this.parser.newPhase('inRow');
	        } else {
		    this.parse_error('unexpected-end-tag', {name: name});
	        }
            },

            endTagIgnore : function(name) {
	        this.parse_error('unexpected-end-tag', {name: name});
            },

            endTagImply : function(name) {
	        if(this.inScope(name, true)) {
		    this.closeCell();
		    this.parser.phase.processEndTag(name);
	        } else {
		    // sometimes inner_html case
		    this.parse_error
	        }
            },

            endTagOther : function(name) {
	        new PHASES.inBody(this.parser, this.tree).processEndTag(name);
            },

            closeCell : function() {
	        if(this.inScope('td', true)) {
		    this.endTagTableCell('td');
	        } else if(this.inScope('th', true)) {
		    this.endTagTableCell('th');
	        }
            },
        },
        inSelect: {
            start_tag_handlers: {
	        html: 'startTagHtml',
	        option: 'startTagOption',
	        optgroup: 'startTagOptgroup',
	        select: 'startTagSelect',
	        '-default': 'startTagOther',
            },

            end_tag_handlers: {
	        option: 'endTagOption',
	        optgroup: 'endTagOptgroup',
	        select: 'endTagSelect',
	        caption: 'endTagTableElements',
	        table: 'endTagTableElements',
	        tbody: 'endTagTableElements',
	        tfoot: 'endTagTableElements',
	        thead: 'endTagTableElements',
	        tr: 'endTagTableElements',
	        td: 'endTagTableElements',
	        th: 'endTagTableElements',
	        '-default': 'endTagOther',
            },
	    
            processCharacters : function(data) {
	        this.tree.insert_text(data);
            },

            startTagOption : function(name, attributes) {
	        // we need to imply </option> if <option> is the current node
	        if(this.tree.open_elements.last().tagname.toLowerCase() == 'option') this.tree.pop_element();
	        this.tree.insert_element(name, attributes);
            },

            startTagOptgroup : function(name, attributes) {
	        if(this.tree.open_elements.last().tagname.toLowerCase() == 'option') this.tree.pop_element();
	        if(this.tree.open_elements.last().tagname.toLowerCase() == 'optgroup') this.tree.pop_element();
	        this.tree.insert_element(name, attributes);
            },
	    
            endTagOption : function(name) {
	        if(this.tree.open_elements.last().tagname.toLowerCase() == 'option') {
		    this.tree.pop_element();
	        } else {
		    this.parse_error('unexpected-end-tag-in-select', {name: 'option'});
	        }
            },

            endTagOptgroup : function(name) {
	        // </optgroup> implicitly closes <option>
	        if(this.tree.open_elements.last().tagname.toLowerCase() == 'option' && this.tree.open_elements[this.tree.open_elements.length - 2].tagname.toLowerCase() == 'optgroup') {
		    this.tree.pop_element();
	        }

	        // it also closes </optgroup>
	        if(this.tree.open_elements.last().tagname.toLowerCase() == 'optgroup') {
		    this.tree.pop_element();
	        } else {
		    // But nothing else
		    this.parse_error('unexpected-end-tag-in-select', {name: 'optgroup'});
	        }
            },

            startTagSelect : function(name) {
	        this.parse_error("unexpected-select-in-select");
	        this.endTagSelect('select');
            },

            endTagSelect : function(name) {
	        if(this.inScope('select', true)) {
		    this.tree.remove_open_elements_until('select');
		    this.parser.reset_insertion_mode(this.tree.open_elements.last());
	        } else {
		    // inner_html case
		    this.parse_error();
	        }
            },

            endTagTableElements : function(name) {
	        this.parse_error('unexpected-end-tag-in-select', {name: name});
	        
	        if(this.inScope(name, true)) {
		    this.endTagSelect('select');
		    this.parser.phase.processEndTag(name);
	        }
            },

            startTagOther : function(name, attributes) {
	        this.parse_error("unexpected-start-tag-in-select", {name: name})
            },

            endTagOther : function(name) {
	        this.parse_error('unexpected-end-tag-in-select', {name: name});
            },

        },
        inSelectInTable: {
            start_tag_handlers: {
	        caption: 'startTagTable',
	        table: 'startTagTable',
	        tbody: 'startTagTable',
	        tfoot: 'startTagTable',
	        thead: 'startTagTable',
	        tr: 'startTagTable',
	        td: 'startTagTable',
	        th: 'startTagTable',
	        '-default': 'startTagOther'
            },

            end_tag_handlers: {
	        caption: 'endTagTable',
	        table: 'endTagTable',
	        tbody: 'endTagTable',
	        tfoot: 'endTagTable',
	        thead: 'endTagTable',
	        tr: 'endTagTable',
	        td: 'endTagTable',
	        th: 'endTagTable',
	        '-default': 'endTagOther'
            },

            processCharacters : function(data) {
	        new PHASES.inSelect(this.parser, this.tree).processCharacters(data)
            },

            startTagTable : function(name, attributes) {
	        this.parse_error("unexpected-table-element-start-tag-in-select-in-table", {name: name})
    	        this.endTagOther("select")
	        this.parser.phase.processStartTag(name, attributes)
            },

            startTagOther : function(name, attributes) {
	        new PHASES.inSelect(this.parser, this.tree).processStartTag(name, attributes)
            },

            endTagTable : function(name) {
	        this.parse_error("unexpected-table-element-end-tag-in-select-in-table", {name: name})
	        if(this.tree.elementInScope(name, true)) {
		    this.endTagOther("select")
		    this.parser.phase.processEndTag(name)
	        }
            },

            endTagOther : function(name) {
	        new PHASES.inSelect(this.parser, this.tree).processEndTag(name)
            },
        },
        afterBody: {
            end_tag_handlers: {
	        html: 'endTagHtml',
	        '-default': 'endTagOther',
            },

            processComment : function(data) {
	        // This is needed because data is to be appended to the html element here
	        // and not to whatever is currently open.
	        this.tree.insert_comment(data, this.tree.open_elements[0]);
            },

            processCharacters : function(data) {
	        this.parse_error('unexpected-char-after-body')
	        this.parser.newPhase('inBody')
	        this.parser.phase.processCharacters(data)
            },

            processStartTag : function(name, attributes, self_closing) {
	        this.parse_error('unexpected-start-tag-after-body', {name: name});
	        this.parser.newPhase('inBody');
	        this.parser.phase.processStartTag(name, attributes, self_closing);
            },

            endTagHtml : function(name) {
	        if(this.parser.inner_html) {
		    this.parse_error('end-html-in-innerhtml');
	        } else {
		    // XXX This may need to be done, not sure
		    // Don't set last_phase to the current phase but to the inBody phase
		    // instead. No need for extra parse_errors if there's something after
		    // </html>.
		    // Try <!doctype html>X</html>X for instance
		    this.parser.last_phase = this.parser.phase;
		    this.parser.newPhase('afterAfterBody');
	        }
            },

            endTagOther : function(name) {
	        this.parse_error('unexpected-end-tag-after-body', {name: name});
	        this.parser.newPhase('inBody');
	        this.parser.phase.processEndTag(name);
            },
        },
        inFrameset: {
            start_tag_handlers: {
	        html: 'startTagHtml',
	        frameset: 'startTagFrameset',
	        frame: 'startTagFrame',
	        noframes: 'startTagNoframes',
	        "-default": 'startTagOther'
            },

            end_tag_handlers: {
	        frameset: 'endTagFrameset',
	        noframes: 'endTagNoframes',
	        '-default': 'endTagOther',
            },

            processCharacters : function(data) {
	        this.parse_error("unexpected-char-in-frameset");
            },

            startTagFrameset : function(name, attributes) {
	        this.tree.insert_element(name, attributes);
            },

            startTagFrame : function(name, attributes) {
	        this.tree.insert_element(name, attributes);
	        this.tree.pop_element();
            },

            startTagNoframes : function(name, attributes) {
	        new PHASES.inBody(this.parser, this.tree).processStartTag(name, attributes);
            },

            startTagOther : function(name, attributes) {
	        this.parse_error("unexpected-start-tag-in-frameset", {name: name});
            },

            endTagFrameset : function(name, attributes) {
	        if(this.tree.open_elements.last().tagname.toLowerCase() == 'html') {
		    // inner_html case
		    this.parse_error("unexpected-frameset-in-frameset-innerhtml");
	        } else {
		    this.tree.pop_element();
	        }

	        if(!this.parser.inner_html && this.tree.open_elements.last().tagname.toLowerCase() != 'frameset') {
		    // If we're not in inner_html mode an the current node is not a "frameset" element (anymore) then switch
		    this.parser.newPhase('afterFrameset');
	        }
            },

            endTagNoframes : function(name) {
	        new PHASES.inBody(this.parser, this.tree).processEndTag(name);
            },

            endTagOther : function(name) {
	        this.parse_error("unexpected-end-tag-in-frameset", {name: name});
            },
        },
        afterFrameset: {
            start_tag_handlers: {
	        html: 'startTagHtml',
	        noframes: 'startTagNoframes',
	        '-default': 'startTagOther',
            },

            end_tag_handlers: {
	        html: 'endTagHtml',
	        '-default': 'endTagOther',
            },

            processCharacters : function(data) {
	        this.parse_error("unexpected-char-after-frameset");
            },

            startTagNoframes : function(name, attributes) {
	        new PHASES.inBody(this.parser, this.tree).processStartTag(name, attributes);
            },

            startTagOther : function(name, attributes) {
	        this.parse_error("unexpected-start-tag-after-frameset", {name: name});
            },

            endTagHtml : function(name) {
	        this.parser.last_phase = this.parser.phase;
	        this.parser.newPhase('trailingEnd');
            },

            endTagOther : function(name) {
	        this.parse_error("unexpected-end-tag-after-frameset", {name: name});
            },
        },
        afterAfterBody: {
            start_tag_handlers: {
	        html: 'startTagHtml',
	        '-default': 'startTagOther',
            },

            processComment : function(data) {
	        this.tree.insert_comment(data);
            },

            processDoctype : function(data) {
	        new PHASES.inBody(this.parser, this.tree).processDoctype(data);
            },

            processSpaceCharacters : function(data) {
	        new PHASES.inBody(this.parser, this.tree).processSpaceCharacters(data);
            },

            startTagHtml : function(data) {
	        new PHASES.inBody(this.parser, this.tree).startTagHtml(data);
            },

            startTagOther : function(name, attributes) {
	        this.parse_error('unexpected-start-tag', {name: name});
	        this.parser.newPhase('inBody');
	        this.parser.phase.processStartTag(name, attributes);
            },

            endTagOther : function(name) {
	        this.parse_error('unexpected-end-tag', {name: name});
	        this.parser.newPhase('inBody');
	        this.parser.phase.processEndTag(name);
            },

            processCharacters : function(data) {
	        this.parse_error('unexpected-char-after-body');
	        this.parser.newPhase('inBody');
	        this.parser.phase.processCharacters(data);
            },
        },
        afterAfterFrameset: {}, // XXX is this supposed to be here?
        inForeignContent: {
            start_tag_handlers: {
	        '-default': 'startTagOther'
            },

            end_tag_handlers: {
	        '-default': 'endTagOther'
            },


            startTagOther : function(name, attributes, self_closing) {
	        if(['mglyph', 'malignmark'].indexOf(name) != -1 
	           && ['mi', 'mo', 'mn', 'ms', 'mtext'].indexOf(this.tree.open_elements.last().tagname) != -1 
	           && this.tree.open_elements.last().namespace == 'math') {
		    this.parser.secondary_phase.processStartTag(name, attributes);
		    if(this.parser.phase == 'inForeignContent') {
		        if(this.tree.open_elements.any(function(e) { return e.namespace })) {
			    this.parser.phase = this.parser.secondary_phase;
		        }
		    }
	        } else if(['b', 'big', 'blockquote', 'body', 'br', 'center', 'code', 'dd', 'div', 'dl', 'dt', 'em', 'embed', 'font', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'hr', 'i', 'img', 'li', 'listing', 'menu', 'meta', 'nobr', 'ol', 'p', 'pre', 'ruby', 's', 'small', 'span', 'strong', 'strike', 'sub', 'sup', 'table', 'tt', 'u', 'ul', 'var'].indexOf(name) != -1) {
		    this.parse_error('html-in-foreign-content', {name: name});
		    while(this.tree.open_elements.last().namespace) {
		        this.tree.open_elements.pop();
		    }
		    this.parser.phase = this.parser.secondary_phase;
		    this.parser.phase.processStartTag(name, attributes);
	        } else {
		    if(this.tree.open_elements.last().namespace == 'math') {
		        attributes = this.adjust_mathml_attributes(attributes)
		    }
		    attributes = this.adjust_foreign_attributes(attributes)
		    this.tree.insert_foreign_element(name, attributes, this.tree.open_elements.last().namespace);
		    if(self_closing) this.tree.open_elements.pop()
	        }
            },

            endTagOther : function(name) {
	        this.parser.secondary_phase.processEndTag(name)
	        if(this.parser.phase == 'inForeignContent') {
		    if(this.tree.open_elements.any(function(e) { return e.namespace })) {
		        this.parser.phase = this.parser.secondary_phase;
		    }
	        }
            },

            processCharacters : function(characters) {
	        this.tree.insert_text(characters);
            },
        },
        trailingEnd: {
            processEOF : function() {},

            processComment : function(data) {
	        this.tree.insert_comment(data);
            },

            processSpaceCharacters : function(data) {
	        this.parser.last_phase.processSpaceCharacters(data);
            },

            processCharacters : function(data) {
	        this.parse_error('expected-eof-but-got-char');
	        this.parser.phase = this.parser.last_phase;
	        this.parser.phase.processCharacters(data);
            },

            processStartTag : function(name, attributes) {
	        this.parse_error('expected-eof-but-got-start-tag');
	        this.parser.phase = this.parser.last_phase;
	        this.parser.phase.processStartTag(name, attributes);
            },

            processEndTag : function(name, attributes) {
	        this.parse_error('expected-eof-but-got-end-tag');
	        this.parser.phase = this.parser.last_phase;
	        this.parser.phase.processEndTag(name);
            },
        },
        rootElement: {
            processEOF : function() {
	        this.insert_html_element()
	        this.parser.phase.processEOF()
            },

            processComment : function(data) {
	        this.tree.insert_comment(data, this.tree.document)
            },

            processSpaceCharacters : function(data) {
            },

            processCharacters : function(data) {
	        this.insert_html_element()
	        this.parser.phase.processCharacters(data)
            },

            processStartTag : function(name, attributes) {
	        if(name == 'html') this.parser.first_start_tag = true
	        this.insert_html_element()
	        this.parser.phase.processStartTag(name, attributes)
            },

            processEndTag : function(name) {
	        this.insert_html_element()
	        this.parser.phase.processEndTag(name)
            },

            insert_html_element : function() {
	        var element = this.tree.createElement('html', [])
	        this.tree.open_elements.push(element)
	        appendNode(this.tree.document, element);
	        this.parser.newPhase('beforeHead')
            },
        },
    };


    // For each parser phase in the object above, convert the set of methods
    // into a constructor function and its methods.
    for(var phasename in PHASES) {
        var methods = PHASES[phasename];
        var constructor = function(parser, tree) {
            Phase.call(this, parser, tree);
            this.name = phasename;
        };
        var prototype = new Phase;
        constructor.prototype = prototype;
        prototype.constructor = constructor;
        for(var method in methods)
            prototype[method] = methods[method];
        PHASES[phasename] = constructor;
    }


    var debugFlags = {any: true}

    debug = function() {
        section = arguments[0];
        if(debugFlags[section] || debugFlags[section.split('.')[0]])
            console.log.apply(console, arguments);
    };

    enableDebug = function(section) {
        debugFlags[section] = true;
    };

    disableDebug = function(section) {
        debugFlags[section] = false;
    };

    // This becomes the HTML5 object outside
    return {
        parseDocument: function parseHTML5Document(text) {
            var parser = new Parser();
            return parser.parse(text);
        },
        parseFragment: function parseHTML5Fragment(text,containerTagName){
            var parser = new Parser();
            return parser.parse_fragment(text, containerTagName);
        }
    };

}());
