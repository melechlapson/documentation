// This code is a Qiskit project.
//
// (C) Copyright IBM 2023.
//
// This code is licensed under the Apache License, Version 2.0. You may
// obtain a copy of this license in the LICENSE file in the root directory
// of this source tree or at http://www.apache.org/licenses/LICENSE-2.0.
//
// Any modifications or derivative works of this code must retain this
// copyright notice, and modified files need to carry a notice indicating
// that they have been altered from the originals.

import { getLastPartFromFullIdentifier } from "../stringUtils";
import { HtmlToMdResult } from "./HtmlToMdResult";
import { Pkg } from "./Pkg";

function addFrontMatter<T extends HtmlToMdResult>(
  results: T[],
  pkg: Pkg,
): void {
  for (let result of results) {
    let markdown = result.markdown;
    if (result.meta.hardcodedFrontmatter) {
      result.markdown = `---
${result.meta.hardcodedFrontmatter}
---

${markdown}
`;
    } else if (result.meta.apiName) {
      result.markdown = `---
title: ${getLastPartFromFullIdentifier(result.meta.apiName)}
description: API reference for ${result.meta.apiName}
in_page_toc_min_heading_level: 1
python_api_type: ${result.meta.apiType}
python_api_name: ${result.meta.apiName}
---

${markdown}
`;
    } else if (result.isReleaseNotes) {
      const versionStr = pkg.hasSeparateReleaseNotes
        ? ` ${pkg.versionWithoutPatch}`
        : "";
      const descriptionSuffix = pkg.hasSeparateReleaseNotes
        ? `in ${pkg.title}${versionStr}`
        : `to ${pkg.title}`;
      result.markdown = `---
title: ${pkg.title}${versionStr} release notes
description: Changes made ${descriptionSuffix}
in_page_toc_max_heading_level: 2
---

${markdown}
`;
    }
  }
}

export default addFrontMatter;
