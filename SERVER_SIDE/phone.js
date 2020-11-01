
const phonePrefix = require("./phonePrefix");
const baseValue = require("./baseValue");

module.exports = {

    GetNameAgency : function GetNameAngency(input) {
        
        if (phonePrefix.Viettel_Prefix.includes(input))
        {
            return 'Viettel'
        }
        else if (phonePrefix.Vietnamobile_Prefix.includes(input))
        {
            return 'Vietnamobile'
        }
        else if (phonePrefix.Gmobile_Prefix.includes(input))
        {
            return 'Gmobile'
        }
        else if (phonePrefix.Mobifone_Prefix.includes(input))
        {
            return 'Mobifone'
        }
        else if (phonePrefix.Vinaphone_Prefix.includes(input))
        {
            return 'Vinaphone'
        }
        return baseValue.ERR_PHONE_ANGENCY_NAME;
    }
};
