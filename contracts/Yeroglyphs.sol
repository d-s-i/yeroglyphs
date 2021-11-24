/**
 *Submitted for verification at Etherscan.io on 2019-04-05
*/

pragma solidity ^0.4.24;

/**
 *
 *      ***    **     ** ********  *******   ******   **     **    ** ********  **     **  ******
 *     ** **   **     **    **    **     ** **    **  **      **  **  **     ** **     ** **    **
 *    **   **  **     **    **    **     ** **        **       ****   **     ** **     ** **
 *   **     ** **     **    **    **     ** **   **** **        **    ********  *********  ******
 *   ********* **     **    **    **     ** **    **  **        **    **        **     **       **
 *   **     ** **     **    **    **     ** **    **  **        **    **        **     ** **    **
 *   **     **  *******     **     *******   ******   ********  **    **        **     **  ******
 *
 *
 *                                                                by Matt Hall and John Watkinson
 *
 *
 * The output of the 'tokenURI' function is a set of instructions to make a drawing.
 * Each symbol in the output corresponds to a cell, and there are 64x64 cells arranged in a square grid.
 * The drawing can be any size, and the pen's stroke width should be between 1/5th to 1/10th the size of a cell.
 * The drawing instructions for the nine different symbols are as follows:
 *
 *   .  Draw nothing in the cell.
 *   O  Draw a circle bounded by the cell.
 *   +  Draw centered lines vertically and horizontally the length of the cell.
 *   X  Draw diagonal lines connecting opposite corners of the cell.
 *   |  Draw a centered vertical line the length of the cell.
 *   -  Draw a centered horizontal line the length of the cell.
 *   \  Draw a line connecting the top left corner of the cell to the bottom right corner.
 *   /  Draw a line connecting the bottom left corner of teh cell to the top right corner.
 *   #  Fill in the cell completely.
 *
 */

import { ERC721 } from "./ERC721.sol";

contract Yeroglyphs is ERC721 {

    uint public constant TOKEN_LIMIT = 512; // 8 for testing, 256 or 512 for prod;
    uint public constant ARTIST_PRINTS = 128; // 2 for testing, 64 for prod;

    uint public constant PRICE = 200 finney;

    // The beneficiary is 350.org
    address public constant BENEFICIARY = 0x50990F09d4f0cb864b8e046e7edC749dE410916b;

    mapping (uint => address) private idToCreator;
    mapping (uint => uint8) private idToSymbolScheme;

    /**
     * @dev A mapping from NFT ID to the seed used to make it.
     */
    mapping (uint256 => uint256) internal idToSeed;
    mapping (uint256 => uint256) internal seedToId;

    mapping (uint256 => uint256) public tokenIdDefaultIndex;
    mapping(uint256 => string[]) public tokenURIs;

    ///////////////////
    //// GENERATOR ////
    ///////////////////

    int constant ONE = int(0x100000000);
    uint constant USIZE = 64;
    int constant SIZE = int(USIZE);
    int constant HALF_SIZE = SIZE / int(2);

    int constant SCALE = int(0x1b81a81ab1a81a823);
    int constant HALF_SCALE = SCALE / int(2);

    bytes prefix = "data:text/plain;charset=utf-8,";

    // 0x2E = .
    // 0x4F = O
    // 0x2B = +
    // 0x58 = X
    // 0x7C = |
    // 0x2D = -
    // 0x5C = \
    // 0x2F = /
    // 0x23 = #

    function abs(int n) internal pure returns (int) {
        if (n >= 0) return n;
        return -n;
    }

    function getScheme(uint a) internal pure returns (uint8) {
        uint index = a % 83;
        uint8 scheme;
        if (index < 20) {
            scheme = 1;
        } else if (index < 35) {
            scheme = 2;
        } else if (index < 48) {
            scheme = 3;
        } else if (index < 59) {
            scheme = 4;
        } else if (index < 68) {
            scheme = 5;
        } else if (index < 73) {
            scheme = 6;
        } else if (index < 77) {
            scheme = 7;
        } else if (index < 80) {
            scheme = 8;
        } else if (index < 82) {
            scheme = 9;
        } else {
            scheme = 10;
        }
        return scheme;
    }

    /* * ** *** ***** ******** ************* ******** ***** *** ** * */

    // The following code generates art.

    function draw(uint id) public view returns (string) {
        uint a = uint(uint160(keccak256(abi.encodePacked(idToSeed[id], block.number))));
        bytes memory output = new bytes(USIZE * (USIZE + 3) + 30);
        uint c;
        for (c = 0; c < 30; c++) {
            output[c] = prefix[c];
        }
        int x = 0;
        int y = 0;
        uint v = 0;
        uint value = 0;
        uint mod = (a % 11) + 5;
        bytes5 symbols = getSymbol(id);

        for (int i = int(0); i < SIZE; i++) {
            y = (2 * (i - HALF_SIZE) + 1);
            if (a % 3 == 1) {
                y = -y;
            } else if (a % 3 == 2) {
                y = abs(y);
            }
            y = y * int(a);
            for (int j = int(0); j < SIZE; j++) {
                x = (2 * (j - HALF_SIZE) + 1);
                if (a % 2 == 1) {
                    x = abs(x);
                }
                x = x * int(a);
                v = uint(x * y / ONE) % mod;
                if (v < 5) {
                    value = uint(symbols[v]);
                } else {
                    value = 0x2E;
                }
                output[c] = byte(bytes32(value << 248));
                c++;
            }
            output[c] = byte(0x25);
            c++;
            output[c] = byte(0x30);
            c++;
            output[c] = byte(0x41);
            c++;
        }
        string memory result = string(output);
        return result;
    }

    function getSymbol(uint id) public view returns (bytes5) {
        bytes5 symbols;

        if (idToSymbolScheme[id] == 0) {
            revert();
        } else if (idToSymbolScheme[id] == 1) {
            symbols = 0x2E582F5C2E; // X/\
        } else if (idToSymbolScheme[id] == 2) {
            symbols = 0x2E2B2D7C2E; // +-|
        } else if (idToSymbolScheme[id] == 3) {
            symbols = 0x2E2F5C2E2E; // /\
        } else if (idToSymbolScheme[id] == 4) {
            symbols = 0x2E5C7C2D2F; // \|-/
        } else if (idToSymbolScheme[id] == 5) {
            symbols = 0x2E4F7C2D2E; // O|-
        } else if (idToSymbolScheme[id] == 6) {
            symbols = 0x2E5C5C2E2E; // \
        } else if (idToSymbolScheme[id] == 7) {
            symbols = 0x2E237C2D2B; // #|-+
        } else if (idToSymbolScheme[id] == 8) {
            symbols = 0x2E4F4F2E2E; // OO
        } else if (idToSymbolScheme[id] == 9) {
            symbols = 0x2E232E2E2E; // #
        } else {
            symbols = 0x2E234F2E2E; // #O
        }

        return symbols;
    }

    /* * ** *** ***** ******** ************* ******** ***** *** ** * */

    function creator(uint _id) external view returns (address) {
        return idToCreator[_id];
    }

    function symbolScheme(uint _id) external view returns (uint8) {
        return idToSymbolScheme[_id];
    }

    function createGlyph(uint seed) external payable returns (string) {
        return _mint(msg.sender, seed);
    }

    /**
     * @dev Mints a new NFT.
     * @notice This is an internal function which should be called from user-implemented external
     * mint function. Its purpose is to show and properly initialize data structures when using this
     * implementation.
     * @param _to The address that will own the minted NFT.
     */
    function _mint(address _to, uint seed) internal returns (string) {
        require(_to != address(0));
        require(numTokens < TOKEN_LIMIT);
        uint amount = 0;
        if (numTokens >= ARTIST_PRINTS) {
            amount = PRICE;
            require(msg.value >= amount);
        }
        require(seedToId[seed] == 0);
        uint id = numTokens + 1;

        idToCreator[id] = _to;
        idToSeed[id] = seed;
        seedToId[seed] = id;
        uint a = uint(uint160(keccak256(abi.encodePacked(seed))));
        idToSymbolScheme[id] = getScheme(a);
        string memory uri = draw(id);
        tokenURIs[id].push(uri);
        tokenIdDefaultIndex[id] = 0;
        emit Generated(id, _to, uri);

        numTokens = numTokens + 1;
        _addNFToken(_to, id);

        if (msg.value > amount) {
            msg.sender.transfer(msg.value - amount);
        }
        if (amount > 0) {
            BENEFICIARY.transfer(amount);
        }

        emit Transfer(address(0), _to, id);
        return uri;
    }

    /**
     * @dev A distinct URI (RFC 3986) for a given NFT.
     * @param _tokenId Id for which we want uri.
     * @return URI of _tokenId.
     */
    function tokenURI(uint256 _tokenId) external view validNFToken(_tokenId) returns (string memory) {
        uint256 _defaultIndex = tokenIdDefaultIndex[_tokenId];
        return tokenURIs[_tokenId][_defaultIndex];
    }

    /**
     * @dev Save the token URI inside an array.
     * @param _tokenId Id for which we want uri.
     * @return URI of _tokenId.
     */
    function saveTokenURI(uint256 _tokenId) external validNFToken(_tokenId) returns(string memory) {
        require(idToCreator[_tokenId] == msg.sender, "Only owner can call");
        string memory uri = draw(_tokenId);
        tokenURIs[_tokenId].push(uri);
        return uri;
    }

    /**
     * @dev Set the default index for the tokenURI.
     * @param _tokenId Id for which we want uri.
     * @param _defaultIndex Index of tokenURI to set as default.
     */
    function setTokenIdDefaultIndex(uint256 _tokenId, uint256 _defaultIndex) external validNFToken(_tokenId) {
        require(idToCreator[_tokenId] == msg.sender, "Only owner can call");

        tokenIdDefaultIndex[_tokenId] = _defaultIndex;
    }

    /**
     * @dev View the current tokenURI for a given tokenId.
     * @param _tokenId Id for which we want the current uri.
     * @return URI of _tokenId.
     */
    function viewCurrentTokenURI(uint256 _tokenId) external view validNFToken(_tokenId) returns (string memory) {
        return(draw(_tokenId));
    }

    /**
     * @dev View a specific, already saved tokenURI.
     * @param _tokenId Id for which we want uri.
     * @param _index Index for which we want to see the tokenURI.
     * @return URI of _tokenId.
     */
    function viewSpecificTokenURI(uint256 _tokenId, uint256 _index) external view returns (string memory) {
        return tokenURIs[_tokenId][_index];
    }

}