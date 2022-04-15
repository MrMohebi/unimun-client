import React from "react";
import {makeVar} from "@apollo/client";

export const currentAd = makeVar(null)
export const lastGottenAppeals = makeVar([])
export const lastAppealSubmitSuccess = makeVar('')
