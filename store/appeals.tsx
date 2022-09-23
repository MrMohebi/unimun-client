import React from "react";
import {makeVar} from "@apollo/client";

export const currentAd = makeVar(null)
export const AppealsStore = makeVar([])
export const EndCursor = makeVar("")
export const LastAppealsScrollPosition = makeVar(0)
export const lastAppealSubmitSuccess = makeVar('')
export const cameFromAppeal = makeVar(false)

