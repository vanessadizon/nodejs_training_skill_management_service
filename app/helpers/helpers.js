const skillModel = require("../models/skill.model");

// handles error code and message
exports.errorHandler = (err, callback) => {
  let error_code = 503;
  let error_message = "Cannot connect to database / System error";

  // duplicate entry error
  if (err.code === "ER_DUP_ENTRY") {
    error_code = 409;
    error_message = "Duplicate entry.";
  }

  // validation entry error
  if (err.isJoi === true) {
    error_code = 422;
    error_message = err.details[0].message;
  }

  callback(error_code, error_message);
};

// loop through references and add to db
exports.addReferences = async (references, skillId) => {
  for (const ref of references) {
    const reference = {
      ref_link: ref.ref_link,
      ref_category: ref.ref_category,
      length_in_mins: ref.length_in_mins,
      skill_id: skillId,
    };
    await skillModel.addReference(reference);
  }
};
