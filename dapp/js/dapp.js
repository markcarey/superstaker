const rpcURL = "eth-mainnet.alchemyapi.io/v2/y2J0jJRJ0W0l7e7J1CVv4zRj-GgBjNHP"

var web3 = AlchemyWeb3.createAlchemyWeb3("wss://" + rpcURL);
//var web3 = AlchemyWeb3.createAlchemyWeb3("http://localhost:8545");
var BN = web3.utils.BN;
var gas = web3.utils.toHex(new BN('2000000000000')); // 2000 Gwei;
var dappChain = 1; // default to Mumbai
var userChain;
var accounts;
var approved = 0;
var approvedSteth = 0;
var delegated = 0;
var ethBal = 0;
var stethBal = 0;
var aSTEHBal = 0;
var aDebtBal = 0;
var factor = 0;
var ratio = 1;
var mode = "eth";
var lidoApr = 0.038;  // TODO: get from api or contract
var aaveWETHBorrowRate = 0.0164;  // TODO: get from api or contract
var selectedAddress;

// subgraph
var subgraphURL = "https://api.studio.thegraph.com/query/27916/superstaker/v0.0.1";
var query = `{\n  totalStakeds(first: 1) {\n    total\n  }\n}`;
var options = {
    method: "POST",
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({"query": query})
};
var totalStaked = 0;

// addresses:
const stakerAddress = "0xDA3231D0Ad3dd50C1B33c167DB27e6200f2C92D0";  // mainnet
//const stakerAddress = "0x3D1A841bC5F799C9887D30dbFA7827A01DC56673"; // localhost
const wethAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
const stethAddress = "0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84";
const dataProviderAddress = "0x057835Ad21a177dbdd3090bB1CAE03EaCF78Fc6d";
const poolAddress = "0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9";
const varDebtTokenAddress = "0xF63B34710400CAd3e044cFfDcAb00a0f32E33eCf";
const varATokenAddress = "0x1982b2F5814301d4e9a8b0201555376e62F82428";
const poolAddressProviderAddress = "0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5";

const prov = {"url": "https://"+rpcURL};
var provider = new ethers.providers.JsonRpcProvider(prov);
if (window.ethereum) {
    provider = new ethers.providers.Web3Provider(window.ethereum);
}
var ethersProvider;
var web3Modalprovider;

const Web3Modal = window.Web3Modal.default;
const WalletConnectProvider = window.WalletConnectProvider.default;

const providerOptions = {
    walletconnect: {
        package: WalletConnectProvider,
        options: {
            rpc: {
                1: "https://" + rpcURL,
                1337: "http://localhost:8545"
            }
        }
    }
};

var web3Modal = new Web3Modal({
    cacheProvider: true, // optional
    providerOptions, // required
});

const varDebtWETH = new ethers.Contract(varDebtTokenAddress, debtTokenABI, provider);
const aSTETH = new ethers.Contract(varATokenAddress, astethABI, provider);
const pool = new ethers.Contract(poolAddress, poolABI, provider);
const steth = new ethers.Contract(stethAddress, stethABI, provider);
const poolAddressProvider = new ethers.Contract(poolAddressProviderAddress, poolAddressProviderABI, provider);
var oracle;

//var staker = new web3.eth.Contract(stakerABI, stakerAddress);
var staker = new ethers.Contract(stakerAddress, stakerABI, provider);

var ethersSigner;

function abbrAddress(address){
    if (!address) {
        //address = ethereum.selectedAddress;
        address = selectedAddress;
    }
    return address.slice(0,4) + "..." + address.slice(address.length - 4);
}

function eth(wei) {
    return parseFloat(web3.utils.fromWei(wei.toString())).toFixed(4);
}

async function main() {
    dappChain = await web3.eth.getChainId();
    console.log("The chainId is " + dappChain);

    const res = await fetch(subgraphURL, options);
    console.log(res);
    const results = await res.json();
    totalStaked = results.data.totalStakeds[0].total;
    console.log("total staked", eth(totalStaked));

    accounts = await web3.eth.getAccounts();
    //connectWallet();
    console.log("b4 accounts");
    if (accounts.length > 0) {
        console.log("accounts > 0");
        ethersSigner = await provider.getSigner()
        //ethersSigner = provider.getSigner();
        selectedAddress = await ethersSigner.getAddress();
        console.log("Account:", selectedAddress); 
        $(".app-wallet-details button.connect span").text( abbrAddress() );
        stethBal = await steth.balanceOf(selectedAddress);
        ethBal = await provider.getBalance(selectedAddress);
        console.log("ETH", ethBal);
        console.log("stETH", stethBal);
        //$("#ethBal").text(eth(ethBal));
        //$("#stethBal").text(eth(stethBal));
        const oracleAddress = await poolAddressProvider.getPriceOracle();
        oracle = new ethers.Contract(oracleAddress, oracleABI, provider);
        $(".card-buttons button.connect").hide().next().show();
    }

    userChain = await ethereum.request({ method: 'eth_chainId' });
    console.log("The chainId of connected account is " + web3.utils.hexToNumber(userChain));

    if ( !correctChain() ) {
        //$("body").append(wrongNetworkModal());
        //$(".close, .modal-backdrop").click(function(){
        //    $(".fade.show").remove();
        //});
    }

    window.ethereum.on('accountsChanged', function () {
        web3.eth.getAccounts(function (error, accts) {
            console.log(accts[0], 'current account after account change');
            accounts = accts;
            location.reload();
        });
    });

    window.ethereum.on('chainChanged', function () {
      location.reload();
    });
    
}


function correctChain() {
  var correct = false;
  if (dappChain == userChain) {
    correct = true;
  }
  return correct;
}

async function connectWallet() {
    $("#status").text("Connecting...");
    if (window.ethereum) {
        //console.log("window.ethereum true");
        await provider.send("eth_requestAccounts", []);
        ethersSigner = provider.getSigner();
        //console.log("Account:", await ethersSigner.getAddress()); 
    } else {
        // The user doesn't have Metamask installed.
        console.log("window.ethereum false");
    } 
} // connectWallet()

async function onConnect() {

    console.log("Opening a dialog", web3Modal);
    try {
        web3Modalprovider = await web3Modal.connect();
    } catch(e) {
        console.log("Could not get a wallet connection", e);
      return;
    }
  
    // Subscribe to accounts change
    provider.on("accountsChanged", (accounts) => {
        web3.eth.getAccounts(function (error, accts) {
            console.log(accts[0], 'current account after account change');
            accounts = accts;
            location.reload();
        });
    });
  
    // Subscribe to chainId change
    provider.on("chainChanged", (chainId) => {
        location.reload();
    });

    //web3 = AlchemyWeb3.createAlchemyWeb3("http://localhost:8545", { writeProvider: web3Modalprovider });
    web3 = AlchemyWeb3.createAlchemyWeb3("https://" + rpcURL, { writeProvider: web3Modalprovider });
    provider = new ethers.providers.Web3Provider(web3Modalprovider);
  
    main();
  }

function fromWei(amount) {
    return web3.utils.fromWei(new BN(amount));
}

async function addToken() {
    const tokenAddress = varATokenAddress;
    const tokenSymbol = 'aSTETH';
    const tokenDecimals = 18;
    const tokenImage = 'https://superstaker.xyz/images/asteth.png';

    try {
        // wasAdded is a boolean. Like any RPC method, an error may be thrown.
        const wasAdded = await ethereum.request({
            method: 'wallet_watchAsset',
            params: {
            type: 'ERC20', // Initially only supports ERC20, but eventually more!
            options: {
                address: tokenAddress, // The address that the token is at.
                symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
                decimals: tokenDecimals, // The number of decimals in the token
                image: tokenImage, // A string url of the token logo
            },
            },
        });

        if (wasAdded) {
            console.log('Thanks for your interest!');
        } else {
            console.log('Your loss!');
        }
    } catch (error) {
        console.log(error);
    }
}

function getFactor(ltv, steth) {
    // ltv as decimal ie. 0.65 for 65% LTV
    // steth as boolean - true if steth, false if ETH
    console.log(ltv, steth);
    var deposit = 1;
    var a = deposit;
    var r = 1;
    if (steth) {
        r = ratio;
    }
    a = 1 * r;
    var debt = 0;
    var newSupply = a;
    for (let i = 1; i <= 15; i++) {
        newSupply = newSupply * ltv; 
        debt += newSupply;
        a += newSupply * r;
        console.log("amt", a);
        console.log("debt", debt);
    }
    factor = debt / deposit;
    factor = Math.floor(factor * 100)
    console.log("factor", factor);
    return factor;
}


$( document ).ready(function() {

    main();

    $(".connect").click(function(){
        //connectWallet();
        onConnect();
        return false;
    });

    $(".nav-steth").click(function(){
        $(this).parent().siblings().find(".nav-link").removeClass("active");
        $(this).addClass("active");
        $(".card-title").text("SuperStake stETH");
        $(".stake-eth").hide();
        if (accounts.length > 0) {
            $(".stake-steth").show();
        }
        $("#amount").val(0.0);
        $(".deposit-symbol").text("stETH");
        $(".deposit-icon-big").attr("src", "/images/steth.png").css("width", "23px");
        $(".deposit-icon").attr("src", "/images/steth.png").css("width", "18px");
        mode = "steth";
        return false;
    });

    $(".nav-eth").click(function(){
        $(this).parent().siblings().find(".nav-link").removeClass("active");
        $(this).addClass("active");
        $(".card-title").text("SuperStake ETH");
        $(".stake-steth").hide();
        if (accounts.length > 0) {
            $(".stake-eth").show();
        }
        $("#amount").val(0.0);
        $(".deposit-symbol").text("ETH");
        $(".deposit-icon").attr("src", "/images/eth.svg").css("width", "13px");
        $(".deposit-icon-big").attr("src", "/images/eth.svg").css("width", "auto");
        mode = "eth";
        return false;
    });

    $(".max").click(function(){
        var max = 0;
        if (mode == "eth") {
            console.log("max ethBal", eth(ethBal));
            max = parseFloat(eth(ethBal)) - 0.1;
        } else {
            max = eth(stethBal);
        }
        $("#amount").val(max);
    });

    $(".ltv-max").click(function(){
        var max = "69";
        $("#ltv").val(max);
        return false;
    });

    $(".add").click(function(){
        addToken();
        return false;
    });

    $("#amount, #ltv").keyup(async function(){
        var amt = $("#amount").val();
        var ltv = $("#ltv").val();
        var amtInWei = ethers.utils.parseEther("" + amt);
        $("#before").text(amt);
        const stethInETH = await oracle.getAssetPrice(stethAddress);
        console.log("stethInETH", stethInETH);
        ratio = stethInETH / 1e18;
        console.log("ratio", ratio);
        var isSteth = false;
        if (mode == "steth") {
            isSteth = true;
        }
        getFactor( (parseFloat(ltv) - 2)/100, isSteth );
        const allowanceAmt = "" + ( amtInWei * (factor / 100) );
        $("#debt").text( eth(allowanceAmt) );
        const stethTotal = parseFloat(amt) + parseFloat( eth(allowanceAmt) );
        $("#atoken").text(stethTotal.toFixed(4));
        var apr = ( (stethTotal * lidoApr) - (parseFloat( eth(allowanceAmt) ) * aaveWETHBorrowRate) ) / parseFloat(amt) * 100;
        $("#apr").text(apr.toFixed(1) + "%");
        return false;
    });

    $(".stake-eth").click(async function(){
        mode = "eth";
        var amt = $("#amount").val();
        var ltv = $("#ltv").val();
        var amtInWei = ethers.utils.parseEther("" + amt);
        console.log(ltv);
        console.log(parseFloat(ltv));
        console.log(parseFloat(ltv) - 1);
        if ( approved >= amt ) {
            $("button.stake-eth").text("Waiting...");
            const atokenBeforeBal = await aSTETH.balanceOf(selectedAddress);
            const debtBeforeBal = await varDebtWETH.balanceOf(selectedAddress);
            console.log("factor", factor);
            var tx = await staker.connect(ethersSigner).stake(factor, {value: amtInWei});
            console.log(tx);
            await tx.wait();
            $("button.stake-eth").text("SuperStaked!!");
            const atokenBal = await aSTETH.balanceOf(selectedAddress);
            const debtBal = await varDebtWETH.balanceOf(selectedAddress);
            $("#atoken").text( eth(atokenBal - atokenBeforeBal) );
            $("#debt").text( eth(debtBal - debtBeforeBal) );
            $("#after").text("After: (actual)");
        } else {
            // need approval
            if ( parseFloat(ltv) > 69 ) {
                alert("The maximum LTV allowed by Aave is 69, anon");
                return;
            }
            if ( (amt.length < 1) || ( parseFloat(amt) <= 0 ) ) {
                alert("Please enter an amount to SuperStake, anon");
                return;
            }
            $("button.stake-eth").text("Approving...");
            const stethInETH = await oracle.getAssetPrice(stethAddress);
            console.log("stethInETH", stethInETH);
            ratio = stethInETH / 1e18;
            console.log("ratio", ratio);
            getFactor( (parseFloat(ltv) - 2)/100, false );
            const allowanceAmt = "" + ( amtInWei * (factor / 100) );
            var tx = await varDebtWETH.connect(ethersSigner).approveDelegation(stakerAddress, allowanceAmt);
            console.log(tx);
            await tx.wait();
            approved = parseFloat(allowanceAmt);
            console.log("approved", approved);
            console.log("done");
            $("button.stake-eth").text("2 of 2: SuperStake ETH");
        }
    });

    $(".stake-steth").click(async function(){
        mode = "steth";
        const stakeFilter = await staker.filters.SuperStaked();
        staker.on(stakeFilter, async (shares, event) => { 
            console.log("stETH staked", shares, event);
        });
        var amt = $("#amount").val();
        var ltv = $("#ltv").val();
        var amtInWei = ethers.utils.parseEther("" + amt);
        console.log(ltv);
        console.log(parseFloat(ltv));
        console.log(parseFloat(ltv) - 1);
        if ( approved >= amt ) {
            $("button.stake-steth").text("Waiting...");
            const atokenBeforeBal = await aSTETH.balanceOf(selectedAddress);
            const debtBeforeBal = await varDebtWETH.balanceOf(selectedAddress);
            console.log("factor", factor);
            var tx = await staker.connect(ethersSigner).superStake(amtInWei, factor);
            console.log(tx);
            await tx.wait();
            $("button.stake-steth").text("SuperStaked!!");
            const atokenBal = await aSTETH.balanceOf(selectedAddress);
            const debtBal = await varDebtWETH.balanceOf(selectedAddress);
            $("#atoken").text( eth(atokenBal - atokenBeforeBal) );
            $("#debt").text( eth(debtBal - debtBeforeBal) );
            $("#after").text("After: (actual)");
        } else {
            // need approvals
            if (approvedSteth >= amt) {
                if ( parseFloat(ltv) > 69 ) {
                    alert("The maximum LTV allowed by Aave is 69, anon");
                    return;
                }
                if ( (amt.length < 1) || ( parseFloat(amt) <= 0 ) ) {
                    alert("Please enter an amount to SuperStake, anon");
                    return;
                }
                $("button.stake-eth").text("Approving...");
                const stethInETH = await oracle.getAssetPrice(stethAddress);
                console.log("stethInETH", stethInETH);
                ratio = stethInETH / 1e18;
                console.log("ratio", ratio);
                getFactor( (parseFloat(ltv) - 2)/100, true );
                const allowanceAmt = "" + ( amtInWei * (factor / 100) );
                var tx = await varDebtWETH.connect(ethersSigner).approveDelegation(stakerAddress, allowanceAmt);
                console.log(tx);
                await tx.wait();
                approved = parseFloat(allowanceAmt);
                console.log("approved", approved);
                console.log("done");
                $("button.stake-steth").text("3 of 3: SuperStake stETH");
            } else {
                // need allowance for stETH
                var tx = await steth.connect(ethersSigner).approve(stakerAddress, amtInWei);
                console.log(tx);
                await tx.wait();
                approvedSteth = parseFloat(amtInWei);
                console.log("approvedSteth", approvedSteth);
                console.log("done");
                $("button.stake-steth").text("2 of 3: Approve");
            } // if approvedSteth
        } // if approved (delegated)
    });


});



// HTML templates

function getHTML(ctx) {
    var html = "";
    html = `
    TBD
    `;
    return html;
}

function wrongNetworkModal(ctx){
    var html = "";
    html = `
    <div class="fade modal-backdrop show"></div>
    <div role="dialog" aria-modal="true" class="modal-theme modal-switch light modal" tabindex="-1" style="display: block;">
        <div class="modal-dialog">
            <div class="modal-content">
            <div class="modal-header"><div class="modal-title-custom modal-title h4">Switch Network</div></div>
                <div class="modal-body" style="margin-left: 20px;">
                    <p>SuperSraker is deployed on Ethereum mainnet.</p>
                    <p><b>To get started, please switch your network by following the instructions below:</b></p>
                    <ol>
                        <li>Open Metamask</li>
                        <li>Click the network select dropdown</li>
                        <li>Click on "Ethereum Mainnet"</li>
                    </ol>
                </div>
            </div>
        </div>
    </div>
    `;
    return html;
}
