const accountConfig = require("../../../model-config/account-config");
const bankConfig = require("../../../model-config/bank-config");
const Logger = require("../../../utils/logger");
const {
  parseSelectFields,
  parseLimitAndOffset,
  parseFilterQueries,
} = require("../../../utils/request");
const { transaction, commit, rollBack } = require("../../../utils/transaction");

class BankService {
  #associationMap = {
    account: {
      model: accountConfig.model,
      required: true,
    },
  };

  #createAssociations(includeQuery) {
    const associations = [];

    if (!Array.isArray(includeQuery)) {
      includeQuery = [includeQuery];
    }
    if (includeQuery?.includes(bankConfig.association.account)) {
      associations.push(this.#associationMap.account);
    }
    return associations;
  }
  async createBank(id, bankName, abbreviation, t) {
    if (!t) {
      t = await transaction();
    }

    try {
      Logger.info("create bank service started...");
      const response = await bankConfig.model.create(
        {
          id,
          bankName,
          abbreviation,
        },
        { t }
      );

      await commit(t);
      Logger.info("create bank service ended...");
      return response;
    } catch (error) {
      await rollBack(t);
      Logger.error(error);
    }
  }

  async getAllBanks(query, t) {
    if (!t) {
      t = await transaction();
    }

    try {
      Logger.info("get all banks service started...");
      let selectArray = parseSelectFields(query, bankConfig.fieldMapping);
      if (!selectArray) {
        selectArray = Object.values(bankConfig.fieldMapping);
      }

      const includeQuery = query.include || [];
      let association = [];
      if (includeQuery) {
        association = this.#createAssociations(includeQuery);
      }

      const arg = {
        attributes: selectArray,
        ...parseLimitAndOffset(query),
        transaction: t,
        ...parseFilterQueries(query, bankConfig.filters),
        include: association,
      };

      const { count, rows } = await bankConfig.model.findAndCountAll(arg);
      commit(t);
      Logger.info("get all banks service ended...");
      return { count, rows };
    } catch (error) {
      await rollBack(t);
      Logger.error(error);
    }
  }

  async getBankById(bankId, query, t) {
    if (!t) {
      t = await transaction();
    }

    try {
      Logger.info("get bank by id service called...");
      let selectArray = parseSelectFields(query, bankConfig.fieldMapping);
      if (!selectArray) {
        selectArray = Object.values(bankConfig.fieldMapping);
      }

      const includeQuery = query.include || [];
      let association = [];
      if (includeQuery) {
        association = this.#createAssociations(includeQuery);
      }

      const arg = {
        attributes: selectArray,
        where: {
          id: bankId,
        },
        transaction: t,
        include: association,
      };

      const response = await bankConfig.model.findOne(arg);
      await commit(t);
      Logger.info("get bank by service ended...");
      return response;
    } catch (error) {
      await rollBack(t);
      Logger.error(error);
    }
  }

  async getBankByAbb(abb, t) {
    if (!t) {
      t = await transaction();
    }
    try {
      Logger.info("Get bank by abbreviation service started...");
      const response = await bankConfig.model.findOne({
        where: {
          abbreviation: abb,
        },
      });
      await commit(t);
      Logger.info("Get bank by abbreviation service ended...");
      return response;
    } catch (error) {
      await rollBack(t);
      Logger.error(error);
    }
  }
}

module.exports = BankService;
