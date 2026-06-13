"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataScope = exports.DATA_SCOPE_KEY = void 0;
const common_1 = require("@nestjs/common");
exports.DATA_SCOPE_KEY = 'data_scope';
const DataScope = (options) => (0, common_1.SetMetadata)(exports.DATA_SCOPE_KEY, options);
exports.DataScope = DataScope;
//# sourceMappingURL=data-scope.decorator.js.map