"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataPermissionPolicy = exports.PolicyType = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
const position_entity_1 = require("./position.entity");
var PolicyType;
(function (PolicyType) {
    PolicyType["ALL"] = "ALL";
    PolicyType["SELF"] = "SELF";
    PolicyType["DEPT_SELF"] = "DEPT_SELF";
    PolicyType["DEPT_TREE"] = "DEPT_TREE";
    PolicyType["CUSTOM_DEPT"] = "CUSTOM_DEPT";
    PolicyType["CUSTOM_FUNC"] = "CUSTOM_FUNC";
})(PolicyType || (exports.PolicyType = PolicyType = {}));
let DataPermissionPolicy = class DataPermissionPolicy {
};
exports.DataPermissionPolicy = DataPermissionPolicy;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'bigint' }),
    __metadata("design:type", Number)
], DataPermissionPolicy.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bigint', nullable: true }),
    __metadata("design:type", Number)
], DataPermissionPolicy.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bigint', nullable: true }),
    __metadata("design:type", Number)
], DataPermissionPolicy.prototype, "position_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], DataPermissionPolicy.prototype, "policy_type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], DataPermissionPolicy.prototype, "is_default", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], DataPermissionPolicy.prototype, "value", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], DataPermissionPolicy.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], DataPermissionPolicy.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)(),
    __metadata("design:type", Date)
], DataPermissionPolicy.prototype, "deleted_at", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.policies),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], DataPermissionPolicy.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => position_entity_1.Position, (pos) => pos.policy),
    (0, typeorm_1.JoinColumn)({ name: 'position_id' }),
    __metadata("design:type", position_entity_1.Position)
], DataPermissionPolicy.prototype, "position", void 0);
exports.DataPermissionPolicy = DataPermissionPolicy = __decorate([
    (0, typeorm_1.Entity)('data_permission_policy')
], DataPermissionPolicy);
//# sourceMappingURL=data-permission-policy.entity.js.map