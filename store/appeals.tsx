import React from "react";
import {makeVar, useReactiveVar} from "@apollo/client";

export const currentAd = makeVar(null)
export const lastGottenAppeals = makeVar([])
